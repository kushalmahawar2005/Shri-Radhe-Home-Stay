"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getNextRoomSortOrder,
} from "@/lib/db/queries";

export type RoomFormState = { error?: string };

const schema = z.object({
  name: z.string().min(1, "Room name zaroori hai."),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug mein sirf chhote letters, numbers aur - chalega."),
  priceNight: z.string().default(""),
  priceAmount: z.coerce.number().int().nonnegative().optional(),
  price: z.string().default("On Request"),
  guests: z.string().default(""),
  bed: z.string().default(""),
  size: z.string().default(""),
  tagline: z.string().default(""),
  blurb: z.string().default(""),
  alt: z.string().default(""),
});

function jsonArray(v: FormDataEntryValue | null): string[] {
  if (typeof v !== "string") return [];
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed.map((x) => String(x)) : [];
  } catch {
    return [];
  }
}

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath("/booking");
  revalidatePath("/admin/rooms");
}

export async function saveRoomAction(
  _prev: RoomFormState,
  formData: FormData
): Promise<RoomFormState> {
  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;

  const parsed = schema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    priceNight: formData.get("priceNight") ?? "",
    priceAmount: formData.get("priceAmount") || undefined,
    price: formData.get("price") || "On Request",
    guests: formData.get("guests") ?? "",
    bed: formData.get("bed") ?? "",
    size: formData.get("size") ?? "",
    tagline: formData.get("tagline") ?? "",
    blurb: formData.get("blurb") ?? "",
    alt: formData.get("alt") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form mein error hai." };
  }

  const data = {
    ...parsed.data,
    image: String(formData.get("image") ?? ""),
    features: jsonArray(formData.get("features")),
    amenities: jsonArray(formData.get("amenities")),
    highlights: jsonArray(formData.get("highlights")),
    gallery: jsonArray(formData.get("gallery")),
    published: formData.get("published") === "on",
  };

  try {
    if (id) {
      await updateRoom(id, data);
    } else {
      const sortOrder = await getNextRoomSortOrder();
      await createRoom({ ...data, sortOrder });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { error: "Ye slug pehle se use ho raha hai. Doosra slug daalo." };
    }
    return { error: "Save nahi hua. Thodi der baad try karo." };
  }

  revalidatePublic();
  redirect("/admin/rooms");
}

export async function deleteRoomAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (id) {
    await deleteRoom(id);
    revalidatePublic();
  }
}
