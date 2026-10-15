import Anthropic from "@anthropic-ai/sdk";
import { buildKnowledge, SYSTEM_PROMPT } from "@/lib/assistant-context";

const MODEL = process.env.ASSISTANT_MODEL || "claude-opus-5-5";
const MAX_TURNS = 12;
const MAX_CHARS = 1200;

const knowledge = buildKnowledge();

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

function parse(body: unknown): { messages: Anthropic.Beta.BetaMessageParam[]; lang: "hi" | "en" } | null {
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

export async function POST(req: Request) {
  const notConfigured = !process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN;
  if (notConfigured) return Response.json({ error: "not_configured" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const input = parse(await req.json().catch(() => null));
  if (!input) return Response.json({ error: "bad_request" }, { status: 400 });

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
  const body = new ReadableStream<Uint8Array>({
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
        controller.enqueue(encoder.encode(input.lang === "hi"
          ? "\n\nअभी उत्तर नहीं मिल पाया। कृपया थोड़ी देर बाद प्रयास करें।"
          : "\n\nCouldn’t get an answer right now. Please try again in a little while."));
      } finally {
        controller.close();
      }
    },
    cancel() { stream.abort(); },
  });

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
