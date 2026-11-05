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
        "The database is not connected yet. Connect the database and add the first admin account.",
    };
  }

  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    // FormData.get returns null when the optional hidden field is absent.
    // Normalize it before validation so direct visits to /admin/login work.
    from: formData.get("from") ?? undefined,
  });
  if (!parsed.success) {
    return { error: "Enter a valid email address and password." };
  }

  let session;
  try {
    session = await authenticate(parsed.data.email, parsed.data.password);
  } catch {
    return { error: "Something went wrong. Please try again in a moment." };
  }
  if (!session) {
    return { error: "The email or password is incorrect." };
  }

  await createSession(session);

  // Only allow redirects back into the admin area.
  const from = parsed.data.from;
  const dest = from && from.startsWith("/admin") ? from : "/admin";
  redirect(dest);
}
