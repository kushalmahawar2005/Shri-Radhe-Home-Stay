"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteBooking,
  getBookingById,
  isRoomAvailable,
  updateBooking,
  updateMessageStatus,
  deleteMessage,
} from "@/lib/db/queries";

function revalidate() {
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  revalidatePath("/admin/availability");
  // Confirming/cancelling changes room availability on the public site.
  revalidatePath("/rooms");
  revalidatePath("/rooms/[slug]", "page");
  revalidatePath("/booking");
}

const todayKey = () => new Date().toISOString().slice(0, 10);

/**
 * One action for every step of a booking:
 *   confirm    — accept a request (blocks the dates; refuses if they're taken)
 *   check_in   — guest arrived
 *   check_out  — guest left (leaving early frees the remaining nights);
 *                optional `paidFull=on` records the balance as collected
 *   no_show    — paid/confirmed but never came (frees the dates)
 *   cancel     — cancel the booking (frees the dates)
 *   refund     — advance returned to the guest
 *   paid_full  — whole amount collected
 *   reopen     — undo a cancellation / no-show (back to confirmed if free)
 */
export async function bookingStepAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const step = String(formData.get("step") || "");
  const back = String(formData.get("back") || "/admin/bookings");
  const go = (msg: string) => {
    const url = new URL(back, "http://x");
    url.searchParams.set("updated", msg);
    redirect(`${url.pathname}${url.search}`);
  };
  if (!id) go("error");

  const row = await getBookingById(id);
  if (!row) go("error");
  const b = row!.booking;

  switch (step) {
    case "confirm":
    case "reopen": {
      if (b.roomId && !(await isRoomAvailable(b.roomId, b.checkIn, b.checkOut, b.id))) go("clash");
      await updateBooking(id, { status: "confirmed" });
      break;
    }
    case "check_in":
      await updateBooking(id, { status: "checked_in" });
      break;
    case "check_out": {
      const today = todayKey();
      // Left before the planned day → give the unused nights back.
      const checkOut = today > b.checkIn && today < b.checkOut ? today : b.checkOut;
      await updateBooking(id, {
        status: "checked_out",
        checkOut,
        ...(formData.get("paidFull") === "on" ? { paymentStatus: "settled" } : {}),
      });
      break;
    }
    case "no_show":
      await updateBooking(id, { status: "no_show" });
      break;
    case "cancel":
      await updateBooking(id, { status: "cancelled" });
      break;
    case "refund":
      await updateBooking(id, { paymentStatus: "refunded" });
      break;
    case "paid_full":
      await updateBooking(id, { paymentStatus: "settled" });
      break;
    default:
      go("error");
  }

  revalidate();
  go(step);
}

/** Kept for older forms: set a raw status. */
export async function setBookingStatusAction(formData: FormData) {
  const status = String(formData.get("status"));
  const map: Record<string, string> = { confirmed: "confirm", cancelled: "cancel" };
  formData.set("step", map[status] ?? status);
  await bookingStepAction(formData);
}

export async function deleteBookingAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (id) {
    await deleteBooking(id);
    revalidate();
    redirect("/admin/bookings?updated=deleted");
  }
}

export async function setMessageStatusAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (id && ["new", "read", "archived"].includes(status)) {
    await updateMessageStatus(id, status);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    redirect("/admin/bookings?view=messages&updated=saved");
  }
}

export async function deleteMessageAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (id) {
    await deleteMessage(id);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    redirect("/admin/bookings?view=messages&updated=deleted");
  }
}
