"use server";

import { revalidatePath } from "next/cache";
import { addGalleryImage, deleteGalleryImage } from "@/lib/db/queries";

export type GalleryState = { error?: string; ok?: boolean };

function revalidate() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function addGalleryAction(
  _prev: GalleryState,
  formData: FormData
): Promise<GalleryState> {
  const src = String(formData.get("src") || "");
  const alt = String(formData.get("alt") || "");
  const category = String(formData.get("category") || "Rooms");
  if (!src) return { error: "Choose a photo before adding it." };
  try {
    await addGalleryImage({ src, alt, category });
  } catch {
    return { error: "The photo could not be added. Please try again." };
  }
  revalidate();
  return { ok: true };
}

export async function deleteGalleryAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (id) {
    await deleteGalleryImage(id);
    revalidate();
  }
}
