"use server";

import { revalidatePath } from "next/cache";
import { createBooking, deleteBooking, isRoomAvailable } from "@/lib/db/queries";

export type BlockState = { error?: string; ok?: boolean };

function revalidate() {
  revalidatePath("/admin/availability");
  revalidatePath("/rooms");
  revalidatePath("/rooms/[slug]", "page");
  revalidatePath("/booking");
}

/** Block a date range for a room (manual, e.g. offline booking / maintenance). */
export async function createBlockAction(
  _prev: BlockState,
  formData: FormData
): Promise<BlockState> {
  const roomId = Number(formData.get("roomId"));
  const checkIn = String(formData.get("checkIn") || "");
  const checkOut = String(formData.get("checkOut") || "");
  const reason = String(formData.get("reason") || "Blocked");

  if (!roomId) return { error: "Choose a room." };
  if (!checkIn || !checkOut) return { error: "Add both dates to continue." };
  if (checkOut <= checkIn)
    return { error: "End date must be after the start date." };

  try {
    const available = await isRoomAvailable(roomId, checkIn, checkOut);
    if (!available) return { error: "These dates already have a booking or block. Choose free dates instead." };
  } catch {
    return { error: "Could not check these dates. Please try again." };
  }

  try {
    await createBooking({
      roomId,
      checkIn,
      checkOut,
      kind: "block",
      status: "confirmed",
      source: "admin",
      guestName: "Manual block",
      notes: reason,
    });
  } catch {
    return { error: "Dates could not be blocked. Please try again." };
  }

  revalidate();
  return { ok: true };
}

export async function deleteBlockAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (id) {
    await deleteBooking(id);
    revalidate();
  }
}
