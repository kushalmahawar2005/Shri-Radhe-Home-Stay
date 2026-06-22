"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { authenticate, createSession } from "@/lib/auth/session";
import { isDbConfigured } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  from: z.string().optional(),
});

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!isDbConfigured()) {
    return {
      error:
        "Database abhi connect nahi hai. Vercel pe Postgres connect karke seed chalao.",
    };
  }

  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    from: formData.get("from"),
  });
  if (!parsed.success) {
    return { error: "Sahi email aur password daalo." };
  }

  let session;
  try {
    session = await authenticate(parsed.data.email, parsed.data.password);
  } catch {
    return { error: "Server error. Thodi der baad try karo." };
  }
  if (!session) {
    return { error: "Galat email ya password." };
  }

  await createSession(session);

  // Only allow redirects back into the admin area.
  const from = parsed.data.from;
  const dest = from && from.startsWith("/admin") ? from : "/admin";
  redirect(dest);
}
