import { NextResponse } from "next/server";
import { adminDb } from "@/lib/adminDb";
import { isAdmin } from "@/lib/adminAuth";
import { STATUSES, TICKET_RE } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unauthorised = () => NextResponse.json({ error: "unauthorised" }, { status: 401 });
const NOTE_MAX = 1000;

export async function GET() {
  if (!(await isAdmin())) return unauthorised();
  const db = adminDb();
  if (!db) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  try {
    const { data, error } = await db.from("complaints").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const rows = (data ?? []) as Record<string, unknown>[];

    /* photos live in a private bucket: give the office a one-hour link for each one */
    const paths = rows.map((r) => r.photo_path).filter((p): p is string => typeof p === "string" && p !== "");
    const urls = new Map<string, string>();
    if (paths.length) {
      const { data: signed, error: signErr } = await db.storage.from("complaint-photos").createSignedUrls(paths, 60 * 60);
      if (signErr) console.error("[admin] signed urls failed:", signErr.message);
      for (const s of signed ?? []) if (s.path && s.signedUrl) urls.set(s.path, s.signedUrl);
    }
    return NextResponse.json({
      complaints: rows.map((r) => ({ ...r, photo_url: (typeof r.photo_path === "string" && urls.get(r.photo_path)) || null })),
    });
  } catch (err) {
    console.error("[admin] load complaints failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return unauthorised();
  const b = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const id = typeof b?.complaint_id === "string" ? b.complaint_id.trim().toUpperCase() : "";
  const status = typeof b?.status === "string" ? b.status : "";
  const note = typeof b?.office_note === "string" ? b.office_note.trim() : b?.office_note == null ? "" : null;
  if (!TICKET_RE.test(id) || !STATUSES.some((s) => s[0] === status) || note === null || note.length > NOTE_MAX) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const db = adminDb();
  if (!db) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  try {
    const { data, error } = await db
      .from("complaints")
      .update({ status, office_note: note || null })
      .eq("complaint_id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ complaint: data });
  } catch (err) {
    console.error("[admin] update complaint failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
