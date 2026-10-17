/* Server-only Supabase client for the admin dashboard. Uses the service-role key, which bypasses RLS,
   so it must never be imported from a client component or given a NEXT_PUBLIC_ name. */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return (client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }));
}
