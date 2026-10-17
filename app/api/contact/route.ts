import nodemailer from "nodemailer";
import { validMobile } from "@/lib/utils";

export const runtime = "nodejs";

/* Enquiry form -> e-mail to the MLA's office through Gmail (an app password, not the account password). */
const USER = process.env.GMAIL_USER?.trim();
const PASS = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
const TO = process.env.CONTACT_TO_EMAIL?.trim() || "Vinaydwivedi71@gmail.com";

const TYPES: Record<string, string> = {
  general: "General enquiry / सामान्य जानकारी",
  meeting: "Meeting request / मुलाकात का अनुरोध",
  programme: "Invitation to a programme / कार्यक्रम में आमंत्रण",
  volunteer: "Join as a volunteer / स्वयंसेवक",
  suggestion: "Suggestion / सुझाव",
  media: "Media / मीडिया",
  other: "Other / अन्य",
};

/* Best-effort per-IP limit (per server instance): 5 enquiries / 10 minutes. */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(), win = 10 * 60_000;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 5;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function POST(req: Request) {
  if (!USER || !PASS) return Response.json({ error: "not_configured" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b || typeof b !== "object") return Response.json({ error: "bad_request" }, { status: 400 });
  if (str(b.website, 50)) return Response.json({ ok: true }); // hidden field filled in: a bot, pretend it worked

  const name = str(b.name, 80), mobile = str(b.mobile, 10), village = str(b.village, 80), date = str(b.date, 20);
  const subject = str(b.subject, 140), message = str(b.message, 3000);
  const type = TYPES[str(b.type, 20)] ?? TYPES.other;
  if (name.length < 2 || !validMobile(mobile) || subject.length < 3 || message.length < 10) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const rows: [string, string][] = [
    ["Type / प्रकार", type],
    ["Name / नाम", name],
    ["Mobile / मोबाइल", mobile],
    ["Village / गाँव", village || "-"],
    ...(date ? ([["Preferred date / पसंदीदा तिथि", date]] as [string, string][]) : []),
    ["Subject / विषय", subject],
  ];
  const footer = `Sent from the website contact form. Reply by calling or WhatsApp on ${mobile}.`;

  const transport = nodemailer.createTransport({ service: "gmail", auth: { user: USER, pass: PASS } });
  try {
    await transport.sendMail({
      from: `"Website enquiry" <${USER}>`,
      to: TO,
      subject: `[Website enquiry] ${type.split(" / ")[0]}: ${subject}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message}\n\n(${footer})`,
      html: `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px">${rows
        .map(([k, v]) => `<tr><td style="color:#666">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`).join("")}</table>
<p style="font-family:Arial,sans-serif;font-size:15px;white-space:pre-wrap">${esc(message)}</p>
<p style="font-family:Arial,sans-serif;font-size:13px;color:#777">${esc(footer)}</p>`,
    });
  } catch (err) {
    console.error("[contact] mail failed:", err instanceof Error ? err.message : err);
    return Response.json({ error: "failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
