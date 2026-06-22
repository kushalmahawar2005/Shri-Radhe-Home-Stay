/**
 * Server-side session helpers (cookies + DB). Use from Server Components,
 * Server Actions and Route Handlers — NOT from middleware (use jwt.ts there).
 */
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import {
  SESSION_COOKIE,
  signSession,
  verifySession,
  type SessionPayload,
} from "./jwt";
import { verifyPassword } from "./password";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Reads and verifies the current admin session (or null). */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

/** Redirects to /admin/login when there is no valid session. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Sets the signed session cookie. */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Clears the session cookie. */
export function destroySession(): void {
  cookies().delete(SESSION_COOKIE);
}

/**
 * Verifies email + password against the admin_users table.
 * Returns the session payload on success, or null on failure.
 */
export async function authenticate(
  email: string,
  password: string
): Promise<SessionPayload | null> {
  const normalized = email.toLowerCase().trim();
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, normalized))
    .limit(1);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return { sub: String(user.id), email: user.email };
}
