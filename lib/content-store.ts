/**
 * ────────────────────────────────────────────────────────────────────────
 *  Content store — the single read API used by the PUBLIC site.
 *
 *  Reads from the database when configured & populated, and transparently
 *  falls back to the defaults in `lib/site-config.ts`. This means the site
 *  keeps rendering even before the DB is provisioned/seeded, and admin
 *  edits show up automatically once they exist.
 *
 *  Server-only. Wrapped in React `cache()` to dedupe within one render.
 * ────────────────────────────────────────────────────────────────────────
 */
import "server-only";
import { cache } from "react";
import { asc, eq } from "drizzle-orm";

import { db, isDbConfigured } from "@/lib/db";
import {
  rooms as roomsTable,
  galleryImages as galleryTable,
  siteContent,
  type Room as DbRoom,
} from "@/lib/db/schema";
import {
  siteConfig,
  galleryImages as defaultGallery,
  type GalleryImage,
} from "@/lib/site-config";

/** Public-facing room shape (what the components consume). */
export type RoomView = {
  slug: string;
  name: string;
  image: string;
  alt: string;
  blurb: string;
  features: string[];
  guests: string;
  price: string;
  priceNight: string;
  tagline: string;
  bed: string;
  size: string;
  gallery: string[];
  amenities: string[];
  highlights: string[];
};

function dbRoomToView(r: DbRoom): RoomView {
  return {
    slug: r.slug,
    name: r.name,
    image: r.image,
    alt: r.alt,
    blurb: r.blurb,
    features: r.features ?? [],
    guests: r.guests,
    price: r.price,
    priceNight: r.priceNight,
    tagline: r.tagline,
    bed: r.bed,
    size: r.size,
    gallery: r.gallery ?? [],
    amenities: r.amenities ?? [],
    highlights: r.highlights ?? [],
  };
}

const defaultRooms: RoomView[] = siteConfig.rooms.map((r) => ({
  ...r,
  features: [...r.features],
  gallery: [...r.gallery],
  amenities: [...r.amenities],
  highlights: [...r.highlights],
}));

/* ── Rooms ──────────────────────────────────────────────────────────── */
export const getRooms = cache(async (): Promise<RoomView[]> => {
  if (!isDbConfigured()) return defaultRooms;
  try {
    const rows = await db
      .select()
      .from(roomsTable)
      .where(eq(roomsTable.published, true))
      .orderBy(asc(roomsTable.sortOrder), asc(roomsTable.id));
    return rows.length ? rows.map(dbRoomToView) : defaultRooms;
  } catch {
    return defaultRooms;
  }
});

export const getRoomBySlug = cache(
  async (slug: string): Promise<RoomView | null> => {
    const all = await getRooms();
    return all.find((r) => r.slug === slug) ?? null;
  }
);

/* ── Gallery ────────────────────────────────────────────────────────── */
export const getGallery = cache(async (): Promise<GalleryImage[]> => {
  if (!isDbConfigured()) return defaultGallery;
  try {
    const rows = await db
      .select()
      .from(galleryTable)
      .orderBy(asc(galleryTable.sortOrder), asc(galleryTable.id));
    return rows.length
      ? rows.map((g) => ({
          src: g.src,
          alt: g.alt,
          category: g.category as GalleryImage["category"],
        }))
      : defaultGallery;
  } catch {
    return defaultGallery;
  }
});

/* ── Editable content blocks (with typed fallback) ──────────────────── */
export const getContent = cache(
  async <T>(key: string, fallback: T): Promise<T> => {
    if (!isDbConfigured()) return fallback;
    try {
      const [row] = await db
        .select()
        .from(siteContent)
        .where(eq(siteContent.key, key))
        .limit(1);
      return row ? (row.value as T) : fallback;
    } catch {
      return fallback;
    }
  }
);
