"use server";

import { revalidatePath } from "next/cache";
import { setContent } from "@/lib/db/queries";

export type ContentState = { error?: string; ok?: boolean };

function revalidateAll() {
  // Content shows across the whole public site.
  revalidatePath("/", "layout");
}

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** Brand basics + contact details (phones, address, social/map links). */
export async function saveBasicsAction(
  _prev: ContentState,
  formData: FormData
): Promise<ContentState> {
  const primary = s(formData, "phonePrimary");
  if (!primary) return { error: "Primary phone number zaroori hai." };

  const brand = {
    name: s(formData, "name"),
    shortName: s(formData, "shortName"),
    tagline: s(formData, "tagline"),
    description: s(formData, "description"),
    intro: s(formData, "intro"),
    templeWalkTime: s(formData, "templeWalkTime"),
    logo: s(formData, "logo") || null,
  };

  const secondary = s(formData, "phoneSecondary");
  const contact = {
    phones: { primary, secondary },
    address: {
      street: s(formData, "street"),
      city: s(formData, "city"),
      state: s(formData, "state"),
      postalCode: s(formData, "postalCode"),
      country: s(formData, "country") || "IN",
      full: s(formData, "fullAddress"),
      lat: Number(formData.get("lat")) || null,
      lng: Number(formData.get("lng")) || null,
    },
    links: {
      instagram: s(formData, "instagram"),
      instagramHandle: s(formData, "instagramHandle"),
      facebook: s(formData, "facebook"),
      mapsEmbed: s(formData, "mapsEmbed"),
      mapsDirections: s(formData, "mapsDirections"),
    },
  };

  try {
    await setContent("brand", brand);
    await setContent("contact", contact);
  } catch {
    return { error: "Save nahi hua. Dobara try karo." };
  }
  revalidateAll();
  return { ok: true };
}

function jsonOf<T>(formData: FormData, key: string): T[] {
  try {
    const parsed = JSON.parse(String(formData.get(key) ?? "[]"));
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export async function saveFaqsAction(
  _prev: ContentState,
  formData: FormData
): Promise<ContentState> {
  const faqs = jsonOf<{ q: string; a: string }>(formData, "faqs").filter(
    (f) => f.q?.trim()
  );
  try {
    await setContent("faqs", faqs);
  } catch {
    return { error: "Save nahi hua." };
  }
  revalidateAll();
  return { ok: true };
}

export async function saveTestimonialsAction(
  _prev: ContentState,
  formData: FormData
): Promise<ContentState> {
  const items = jsonOf<{
    quote: string;
    author: string;
    location: string;
    rating: number;
  }>(formData, "testimonials").filter((t) => t.quote?.trim());
  try {
    await setContent("testimonials", items);
  } catch {
    return { error: "Save nahi hua." };
  }
  revalidateAll();
  return { ok: true };
}
