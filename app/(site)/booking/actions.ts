"use server";

import { z } from "zod";
import { isDbConfigured } from "@/lib/db";
import { notifyAdminsQuickly, shortDate } from "@/lib/push";
import {
  createBooking,
  getRoomById,
  getRoomIdBySlug,
  isRoomAvailable,
  listRooms,
} from "@/lib/db/queries";

export type BookingResult = {
  ok: boolean;
  available?: boolean;
  bookingId?: number;
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
  paymentMode: z.string().default("pay_at_homestay"),
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
    const result = await createBooking({
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
      paymentMode: data.paymentMode,
    });
    const room = roomId ? await getRoomById(roomId).catch(() => null) : null;
    await notifyAdminsQuickly({
      title: available ? "🛎️ New booking request" : "⚠️ Booking request — dates look taken",
      body: `${data.name || "A guest"} · ${room?.name ?? data.roomSlug} · ${shortDate(data.checkIn)} → ${shortDate(data.checkOut)} · ${data.guests || "guests not set"} · Pay at villa`,
      url: "/admin/bookings/",
      tag: `booking-${result.id}`,
    });
    return { ok: true, available, bookingId: result.id };
  } catch {
    return { ok: false, error: "save-failed" };
  }
}

export type AvailabilityResult =
  | { status: "available" }
  | { status: "booked"; alternatives: { slug: string; name: string; priceNight: string }[] }
  | { status: "unknown" };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Live availability check for one room (pages are cached, so the client's
 * blocked-date list can be up to an hour old). When the room is taken, also
 * returns the other published rooms that are free for the same dates.
 */
export async function checkRoomAvailability(input: {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
}): Promise<AvailabilityResult> {
  const { roomSlug, checkIn, checkOut } = input;
  if (!DATE.test(checkIn) || !DATE.test(checkOut) || checkOut <= checkIn) {
    return { status: "unknown" };
  }
  if (!isDbConfigured()) return { status: "unknown" };

  try {
    const rooms = (await listRooms()).filter((r) => r.published);
    const target = rooms.find((r) => r.slug === roomSlug);
    if (!target) return { status: "unknown" };
    if (await isRoomAvailable(target.id, checkIn, checkOut)) return { status: "available" };

    const others = rooms.filter((r) => r.id !== target.id);
    const free = await Promise.all(others.map((r) => isRoomAvailable(r.id, checkIn, checkOut)));
    return {
      status: "booked",
      alternatives: others
        .filter((_, i) => free[i])
        .map((r) => ({ slug: r.slug, name: r.name, priceNight: r.priceNight })),
    };
  } catch {
    return { status: "unknown" };
  }
}
