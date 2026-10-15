/* Complaint storage: Supabase when configured, otherwise the visitor's own browser (demo mode). */
import type { SupabaseClient } from "@supabase/supabase-js";
import { site } from "./site";
import { store, type Category, type Status } from "./utils";

export type Complaint = {
  complaint_id: string;
  name: string;
  mobile: string;
  village: string;
  category: Category;
  subject: string;
  description: string;
  status: Status;
  photo_path?: string;
  office_note?: string | null;
  rating?: number | null;
  created_at?: string;
};

/* what the status lookup returns (no personal data) */
export type ComplaintStatus = Pick<Complaint, "category" | "village" | "subject" | "status" | "office_note" | "created_at" | "rating">;
export type Counts = { total: number; resolved: number };

let sb: SupabaseClient | null = null;
async function getSb() {
  if (!site.supabaseUrl || !site.supabaseAnonKey) return null;
  if (sb) return sb;
  const { createClient } = await import("@supabase/supabase-js");
  return (sb = createClient(site.supabaseUrl, site.supabaseAnonKey));
}

export const isDemoMode = () => !site.supabaseUrl || !site.supabaseAnonKey;

const LS = "mhn_complaints";

export async function saveComplaint(c: Complaint, file?: File | null) {
  const client = await getSb();
  if (client) {
    if (file) {
      const path = `${c.complaint_id}/${Date.now()}-${file.name.replace(/[^\w.]/g, "_")}`;
      const up = await client.storage.from("complaint-photos").upload(path, file);
      if (!up.error) c.photo_path = path;
    }
    const { error } = await client.from("complaints").insert(c);
    if (error) throw error;
  } else {
    const all = store.get<Complaint[]>(LS, []);
    all.push({ ...c, created_at: new Date().toISOString() });
    store.set(LS, all);
  }
}

/** Look up by ticket number + last 4 digits of the mobile number. */
export async function findComplaint(id: string, last4: string): Promise<ComplaintStatus | undefined> {
  const client = await getSb();
  if (client) {
    const { data, error } = await client.rpc("get_complaint_status", { p_id: id, p_last4: last4 });
    if (error) throw error;
    return (data as ComplaintStatus[] | null)?.[0];
  }
  return store.get<Complaint[]>(LS, []).find((c) => c.complaint_id === id && c.mobile.endsWith(last4));
}

export async function sendFeedback(id: string, last4: string, rating: number) {
  const client = await getSb();
  if (client) {
    const { error } = await client.rpc("submit_feedback", { p_id: id, p_last4: last4, p_rating: rating });
    if (error) throw error;
    return;
  }
  const all = store.get<Complaint[]>(LS, []);
  const c = all.find((x) => x.complaint_id === id && x.mobile.endsWith(last4));
  if (c) { c.rating = rating; store.set(LS, all); }
}

export async function loadCounts(): Promise<Counts | null> {
  const client = await getSb();
  if (client) {
    const { data } = await client.rpc("complaint_counts");
    const c = (data as Counts[] | null)?.[0];
    return c ? { total: Number(c.total), resolved: Number(c.resolved) } : null;
  }
  const all = store.get<Complaint[]>(LS, []);
  return all.length ? { total: all.length, resolved: all.filter((x) => x.status === "resolved").length } : null;
}
