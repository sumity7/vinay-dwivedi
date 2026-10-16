import Anthropic from "@anthropic-ai/sdk";
import { buildKnowledge, SYSTEM_PROMPT } from "@/lib/assistant-context";

/* The assistant runs on Claude when ANTHROPIC_API_KEY is set, otherwise on Groq's free tier when GROQ_API_KEY is set. */
const MODEL = process.env.ASSISTANT_MODEL || "claude-opus-5-5";
const GROQ_MODEL = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";
const MAX_TURNS = 12;
const MAX_CHARS = 1200;

const knowledge = buildKnowledge();
const knowledgeCompact = buildKnowledge(true);

/* Best-effort per-IP limit (per server instance): 20 questions / 10 minutes. */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(), win = 10 * 60_000;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 20;
}

type InMsg = { role: "user" | "assistant"; content: string };
type Parsed = { messages: Anthropic.Beta.BetaMessageParam[]; lang: "hi" | "en" };

function parse(body: unknown): Parsed | null {
  if (!body || typeof body !== "object") return null;
  const { messages, lang } = body as { messages?: InMsg[]; lang?: string };
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_TURNS) return null;
  const clean: Anthropic.Beta.BetaMessageParam[] = [];
  for (const [i, m] of messages.entries()) {
    const role = i % 2 === 0 ? "user" : "assistant";
    if (m?.role !== role || typeof m.content !== "string" || !m.content.trim()) return null;
    clean.push({ role, content: m.content.slice(0, role === "user" ? MAX_CHARS : 4000) });
  }
  if (clean[clean.length - 1].role !== "user") return null;
  return { messages: clean, lang: lang === "en" ? "en" : "hi" };
}

const plain = (body: ReadableStream<Uint8Array>) =>
  new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

const sorry = (lang: "hi" | "en") => lang === "hi"
  ? "\n\nअभी उत्तर नहीं मिल पाया। कृपया थोड़ी देर बाद प्रयास करें।"
  : "\n\nCouldn’t get an answer right now. Please try again in a little while.";

export async function POST(req: Request) {
  const useClaude = !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (!useClaude && !groqKey) return Response.json({ error: "not_configured" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const input = parse(await req.json().catch(() => null));
  if (!input) return Response.json({ error: "bad_request" }, { status: 400 });

  return useClaude ? claude(input) : groq(input, groqKey!);
}

/* ---------- Claude ---------- */
function claude(input: Parsed) {
  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 2048,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    system: [
      { type: "text", text: `${SYSTEM_PROMPT}\n\n<website_information>\n${knowledge}\n</website_information>`, cache_control: { type: "ephemeral" } },
      { type: "text", text: `The visitor is reading the ${input.lang === "hi" ? "Hindi" : "English"} version of the site.` },
    ],
    messages: input.messages,
  });

  const encoder = new TextEncoder();
  return plain(new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode(input.lang === "hi"
            ? "\n\nमाफ़ कीजिए, मैं इस प्रश्न का उत्तर नहीं दे सकता। कृपया संपर्क पृष्ठ से कार्यालय से बात करें।"
            : "\n\nSorry, I can’t help with that question. Please reach the office through the contact page."));
        }
      } catch (err) {
        console.error("assistant error", err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
        controller.enqueue(encoder.encode(sorry(input.lang)));
      } finally {
        controller.close();
      }
    },
    cancel() { stream.abort(); },
  }));
}

/* ---------- Groq (free tier): OpenAI-style streaming ---------- */
async function groq(input: Parsed, key: string) {
  const payload = JSON.stringify({
    model: GROQ_MODEL,
    stream: true,
    // reasoning tokens count against this too, so leave room for them
    max_tokens: 1400,
    temperature: 0.3,
    reasoning_effort: "low",
    messages: [
      { role: "system", content: `${SYSTEM_PROMPT}\n\n<website_information>\n${knowledgeCompact}\n</website_information>\nThe visitor is reading the ${input.lang === "hi" ? "Hindi" : "English"} version of the site.` },
      ...input.messages.map((m) => ({ role: m.role, content: m.content as string })),
    ],
  });
  const call = () => fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: payload,
    signal: AbortSignal.timeout(40_000),
  });

  let res: Response;
  try {
    res = await call();
    /* the free tier limits tokens per minute: while it says "try again in Ns", wait and retry, so a busy minute means a slower answer, not an error */
    let waited = 0;
    for (let tries = 0; res.status === 429 && tries < 3; tries++) {
      const said = (await res.clone().text().catch(() => "")).match(/try again in ([0-9.]+)s/)?.[1];
      const wait = Math.max(Number(res.headers.get("retry-after")) || 0, Number(said) || 0, 1);
      if (waited + wait > 20) break;
      waited += wait;
      await new Promise((r) => setTimeout(r, wait * 1000 + 250));
      res = await call();
    }
  } catch (err) {
    console.error("[assistant] Groq request failed:", err instanceof Error ? err.message : err);
    return Response.json({ error: "failed" }, { status: 502 });
  }

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    console.error(`[assistant] Groq ${res.status}:`, detail.slice(0, 300));
    if (res.status === 401 || res.status === 403) return Response.json({ error: "not_configured" }, { status: 503 });
    if (res.status === 429) return Response.json({ error: "busy" }, { status: 429 });
    return Response.json({ error: "failed" }, { status: 502 });
  }

  const encoder = new TextEncoder(), decoder = new TextDecoder();
  const reader = res.body.getReader();
  return plain(new ReadableStream<Uint8Array>({
    async start(controller) {
      let buf = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const text = (JSON.parse(data) as { choices?: { delta?: { content?: string } }[] }).choices?.[0]?.delta?.content;
              if (text) controller.enqueue(encoder.encode(text));
            } catch { /* partial or keep-alive line */ }
          }
        }
      } catch (err) {
        console.error("[assistant] Groq stream error:", err instanceof Error ? err.message : err);
        controller.enqueue(encoder.encode(sorry(input.lang)));
      } finally {
        controller.close();
      }
    },
    cancel() { reader.cancel().catch(() => {}); },
  }));
}
