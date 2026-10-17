// TEMPORARY dev-only Supabase health check (read-only). Delete after use.
export async function GET() {
  if (process.env.NODE_ENV !== "development") return new Response("no", { status: 404 });
  const u = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const h = { apikey: k, "Content-Type": "application/json" };
  const call = async (name: string, body: object) => {
    try { const r = await fetch(`${u}/rest/v1/rpc/${name}`, { method: "POST", headers: h, body: JSON.stringify(body) }); return { status: r.status, body: (await r.text()).slice(0, 300) }; }
    catch (e) { return { error: String(e) }; }
  };
  let bucket;
  try { const r = await fetch(`${u}/storage/v1/bucket/complaint-photos`, { headers: { apikey: k, Authorization: `Bearer ${k}` } }); bucket = { status: r.status, body: (await r.text()).slice(0, 200) }; } catch (e) { bucket = { error: String(e) }; }
  let table;
  try { const r = await fetch(`${u}/rest/v1/complaints?select=id&limit=1`, { headers: h }); table = { status: r.status, body: (await r.text()).slice(0, 200) }; } catch (e) { table = { error: String(e) }; }
  return Response.json({ table,
    configured: !!u && !!k, host: u.replace(/^https:\/\/([a-z0-9]{4}).*/, "$1…"),
    counts: await call("complaint_counts", {}),
    status: await call("get_complaint_status", { p_id: "TEST-000", p_last4: "0000" }),
    bucket,
  });
}
