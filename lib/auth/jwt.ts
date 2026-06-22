/**
 * Edge-safe JWT helpers (jose only — no Node APIs, no next/headers).
 * Usable from middleware AND server code.
 */
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "srh_admin_session";

export type SessionPayload = {
  sub: string; // admin user id
  email: string;
};

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    // Dev fallback keeps local builds working; production should set AUTH_SECRET.
    return new TextEncoder().encode("dev-insecure-secret-change-me-please-0000");
  }
  return new TextEncoder().encode(s);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return { sub: String(payload.sub), email: String(payload.email ?? "") };
  } catch {
    return null;
  }
}
