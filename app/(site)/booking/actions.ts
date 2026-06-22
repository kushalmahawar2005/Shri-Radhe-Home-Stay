"use server";

import { z } from "zod";
import { isDbConfigured } from "@/lib/db";
import {
  createBooking,
  getRoomIdBySlug,
  isRoomAvailable,
} from "@/lib/db/queries";

export type BookingResult = {
  ok: boolean;
  available?: boolean;
  error?: string;
};

const schema = z.object({
  roomSlug: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.string().default(""),
  name: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
  notes: z.string().default(""),
});

/**
 * Saves a public booking request to the database (status: pending).
 * Returns { available } so the UI can hint if the dates look taken.
 * Gracefully no-ops (ok:false) when the DB isn't configured, so the
 * WhatsApp/confirmation flow still works.
 */
export async function submitBookingRequest(
  input: z.input<typeof schema>
): Promise<BookingResult> {
  if (!isDbConfigured()) return { ok: false, error: "no-db" };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const data = parsed.data;

  try {
    const roomId = await getRoomIdBySlug(data.roomSlug);
    let available = true;
    if (roomId) {
      available = await isRoomAvailable(roomId, data.checkIn, data.checkOut);
    }
    await createBooking({
      roomId: roomId ?? null,
      guestName: data.name,
      phone: data.phone,
      email: data.email,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      notes: data.notes,
      status: "pending",
      kind: "request",
      source: "web",
    });
    return { ok: true, available };
  } catch {
    return { ok: false, error: "save-failed" };
  }
}
