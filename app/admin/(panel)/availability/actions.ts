"use server";

import { revalidatePath } from "next/cache";
import { createBooking, deleteBooking } from "@/lib/db/queries";

export type BlockState = { error?: string; ok?: boolean };

function revalidate() {
  revalidatePath("/admin/availability");
  revalidatePath("/rooms");
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

  if (!roomId) return { error: "Room select karo." };
  if (!checkIn || !checkOut) return { error: "Dono dates daalo." };
  if (checkOut <= checkIn)
    return { error: "Check-out date check-in ke baad honi chahiye." };

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
    return { error: "Block save nahi hua. Dobara try karo." };
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
