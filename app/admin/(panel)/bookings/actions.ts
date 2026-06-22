"use server";

import { revalidatePath } from "next/cache";
import {
  updateBookingStatus,
  deleteBooking,
  updateMessageStatus,
  deleteMessage,
} from "@/lib/db/queries";

function revalidate() {
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  // Confirming/cancelling changes room availability on the public site.
  revalidatePath("/rooms");
  revalidatePath("/booking");
}

export async function setBookingStatusAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (id && ["pending", "confirmed", "cancelled"].includes(status)) {
    await updateBookingStatus(id, status);
    revalidate();
  }
}

export async function deleteBookingAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (id) {
    await deleteBooking(id);
    revalidate();
  }
}

export async function setMessageStatusAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (id && ["new", "read", "archived"].includes(status)) {
    await updateMessageStatus(id, status);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
  }
}

export async function deleteMessageAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (id) {
    await deleteMessage(id);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
  }
}
