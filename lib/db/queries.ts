/**
 * Server-side data access used by the admin panel (and some public reads).
 * All functions assume the DB is configured; callers in the public site
 * should prefer `lib/content-store.ts` which has graceful fallbacks.
 */
import "server-only";
import { and, asc, desc, eq, gt, lt, ne, or, sql } from "drizzle-orm";
import { db } from "./index";
import {
  rooms,
  bookings,
  messages,
  galleryImages,
  siteContent,
  type NewRoom,
  type NewBooking,
} from "./schema";

/* ── Dashboard ──────────────────────────────────────────────────────── */
export async function getDashboardStats() {
  const [roomCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(rooms);
  const [pendingBookings] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bookings)
    .where(and(eq(bookings.kind, "request"), eq(bookings.status, "pending")));
  const [confirmedBookings] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bookings)
    .where(and(eq(bookings.kind, "request"), eq(bookings.status, "confirmed")));
  const [newMessages] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(messages)
    .where(eq(messages.status, "new"));
  return {
    rooms: roomCount?.n ?? 0,
    pendingBookings: pendingBookings?.n ?? 0,
    confirmedBookings: confirmedBookings?.n ?? 0,
    newMessages: newMessages?.n ?? 0,
  };
}

/* ── Rooms ──────────────────────────────────────────────────────────── */
export async function listRooms() {
  return db
    .select()
    .from(rooms)
    .orderBy(asc(rooms.sortOrder), asc(rooms.id));
}

export async function getRoomById(id: number) {
  const [row] = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1);
  return row ?? null;
}

export async function getRoomIdBySlug(slug: string): Promise<number | null> {
  const [row] = await db
    .select({ id: rooms.id })
    .from(rooms)
    .where(eq(rooms.slug, slug))
    .limit(1);
  return row?.id ?? null;
}

export async function getNextRoomSortOrder() {
  const [row] = await db
    .select({ max: sql<number>`coalesce(max(${rooms.sortOrder}), -1)::int` })
    .from(rooms);
  return (row?.max ?? -1) + 1;
}

export async function createRoom(data: NewRoom) {
  const [row] = await db.insert(rooms).values(data).returning();
  return row;
}

export async function updateRoom(id: number, data: Partial<NewRoom>) {
  const [row] = await db
    .update(rooms)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(rooms.id, id))
    .returning();
  return row;
}

export async function deleteRoom(id: number) {
  await db.delete(rooms).where(eq(rooms.id, id));
}

/* ── Bookings & availability ────────────────────────────────────────── */
export async function listBookings() {
  return db
    .select({
      booking: bookings,
      roomName: rooms.name,
      roomSlug: rooms.slug,
    })
    .from(bookings)
    .leftJoin(rooms, eq(bookings.roomId, rooms.id))
    .orderBy(desc(bookings.createdAt));
}

export async function createBooking(data: NewBooking) {
  const [row] = await db.insert(bookings).values(data).returning();
  return row;
}

export async function updateBookingStatus(id: number, status: string) {
  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
}

export async function deleteBooking(id: number) {
  await db.delete(bookings).where(eq(bookings.id, id));
}

export async function updateBookingPayment(
  id: number,
  data: {
    paymentStatus?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  }
) {
  const updateData: Record<string, unknown> = {};
  if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;
  if (data.razorpayOrderId !== undefined) updateData.razorpayOrderId = data.razorpayOrderId;
  if (data.razorpayPaymentId !== undefined) updateData.razorpayPaymentId = data.razorpayPaymentId;
  await db.update(bookings).set(updateData).where(eq(bookings.id, id));
}

/**
 * Marks the booking tied to a Razorpay order as paid + confirmed. Keyed by
 * the server-stored `razorpayOrderId` (NOT a client-supplied id) so a caller
 * can't mark an arbitrary booking paid. Confirming it also blocks the dates
 * on the public calendar. Returns the booking id, or null if none matched.
 */
export async function markBookingPaidByOrderId(
  orderId: string,
  paymentId: string
) {
  const [row] = await db
    .update(bookings)
    .set({
      paymentStatus: "paid",
      razorpayPaymentId: paymentId,
      status: "confirmed",
    })
    .where(eq(bookings.razorpayOrderId, orderId))
    .returning({ id: bookings.id });
  return row ?? null;
}

/** Marks the booking tied to a Razorpay order as payment-failed. */
export async function markBookingPaymentFailedByOrderId(orderId: string) {
  const [row] = await db
    .update(bookings)
    .set({ paymentStatus: "failed" })
    .where(eq(bookings.razorpayOrderId, orderId))
    .returning({ id: bookings.id });
  return row ?? null;
}

export async function getBookingById(id: number) {
  const [row] = await db
    .select({
      booking: bookings,
      roomName: rooms.name,
      roomSlug: rooms.slug,
    })
    .from(bookings)
    .leftJoin(rooms, eq(bookings.roomId, rooms.id))
    .where(eq(bookings.id, id))
    .limit(1);
  return row ?? null;
}

/**
 * Returns availability-blocking rows for a room: manual blocks and
 * confirmed bookings. `checkOut` is treated as exclusive (guest leaves
 * that morning), so overlap is start < otherEnd AND end > otherStart.
 */
export async function getRoomBlocks(roomId: number) {
  return db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.roomId, roomId),
        or(eq(bookings.kind, "block"), eq(bookings.status, "confirmed"))
      )
    )
    .orderBy(asc(bookings.checkIn));
}

/**
 * Is the room free for [checkIn, checkOut)? Ignores cancelled rows and
 * (optionally) one booking id (when editing).
 */
export async function isRoomAvailable(
  roomId: number,
  checkIn: string,
  checkOut: string,
  ignoreBookingId?: number
) {
  const conditions = [
    eq(bookings.roomId, roomId),
    or(eq(bookings.kind, "block"), eq(bookings.status, "confirmed")),
    lt(bookings.checkIn, checkOut),
    gt(bookings.checkOut, checkIn),
  ];
  if (ignoreBookingId) conditions.push(ne(bookings.id, ignoreBookingId));
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bookings)
    .where(and(...conditions));
  return (rows[0]?.n ?? 0) === 0;
}

/* ── Messages ───────────────────────────────────────────────────────── */
export async function listMessages() {
  return db.select().from(messages).orderBy(desc(messages.createdAt));
}

export async function createMessage(data: {
  name: string;
  phone: string;
  email: string;
  message: string;
}) {
  const [row] = await db.insert(messages).values(data).returning();
  return row;
}

export async function updateMessageStatus(id: number, status: string) {
  await db.update(messages).set({ status }).where(eq(messages.id, id));
}

export async function deleteMessage(id: number) {
  await db.delete(messages).where(eq(messages.id, id));
}

/* ── Gallery ────────────────────────────────────────────────────────── */
export async function listGallery() {
  return db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));
}

export async function addGalleryImage(data: {
  src: string;
  alt: string;
  category: string;
  sortOrder?: number;
}) {
  const [row] = await db.insert(galleryImages).values(data).returning();
  return row;
}

export async function deleteGalleryImage(id: number) {
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
}

/* ── Site content ───────────────────────────────────────────────────── */
export async function getContentRow<T = unknown>(key: string): Promise<T | null> {
  const [row] = await db
    .select()
    .from(siteContent)
    .where(eq(siteContent.key, key))
    .limit(1);
  return row ? (row.value as T) : null;
}

export async function setContent(key: string, value: unknown) {
  await db
    .insert(siteContent)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteContent.key,
      set: { value, updatedAt: new Date() },
    });
}
