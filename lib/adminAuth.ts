/* Admin login: one shared password (ADMIN_PASSWORD), no user accounts. The cookie is `<expiryMs>.<HMAC signature>`. */
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";
const TTL_MS = 12 * 60 * 60 * 1000;

const password = () => process.env.ADMIN_PASSWORD?.trim() ?? "";
/* falls back to the password, so changing the password logs everyone out */
const secret = () => process.env.ADMIN_SESSION_SECRET?.trim() || password();

export const adminEnabled = () => password().length >= 6;

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}
function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function checkPassword(given: string) {
  return adminEnabled() && safeEqual(given.trim(), password());
}
export function makeSession() {
  const exp = String(Date.now() + TTL_MS);
  return { value: `${exp}.${sign(exp)}`, maxAge: TTL_MS / 1000 };
}
export function validSession(value: string | undefined) {
  if (!value || !adminEnabled()) return false;
  const [exp, mac] = value.split(".");
  if (!exp || !mac || !safeEqual(mac, sign(exp))) return false;
  return Number(exp) > Date.now();
}
export async function isAdmin() {
  const jar = await cookies();
  return validSession(jar.get(ADMIN_COOKIE)?.value);
}
