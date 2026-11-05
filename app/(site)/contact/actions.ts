"use server";

import { z } from "zod";
import { isDbConfigured } from "@/lib/db";
import { createMessage } from "@/lib/db/queries";
import { notifyAdminsQuickly } from "@/lib/push";

export type ContactResult = { ok: boolean; error?: string };

const schema = z.object({
  name: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
  message: z.string().min(1),
});

/** Saves a contact-form submission to the admin inbox. */
export async function submitContactMessage(
  input: z.input<typeof schema>
): Promise<ContactResult> {
  if (!isDbConfigured()) return { ok: false, error: "no-db" };
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  try {
    const row = await createMessage(parsed.data);
    const preview = parsed.data.message.replace(/\s+/g, " ").slice(0, 120);
    await notifyAdminsQuickly({
      title: `💬 New message from ${parsed.data.name || "a visitor"}`,
      body: preview,
      url: "/admin/bookings/?view=messages",
      tag: `message-${row.id}`,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "save-failed" };
  }
}
