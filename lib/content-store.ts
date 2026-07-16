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
import { and, asc, eq, gte, or } from "drizzle-orm";

import { db, isDbConfigured } from "@/lib/db";
import {
  rooms as roomsTable,
  bookings as bookingsTable,
  galleryImages as galleryTable,
  siteContent,
  type Room as DbRoom,
} from "@/lib/db/schema";
import {
  siteConfig,
  galleryImages as defaultGallery,
  faqs as defaultFaqs,
  type GalleryImage,
  type Testimonial,
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

/* ── Availability (admin date blocks + confirmed bookings) ──────────── */
/** A blocked stay: nights [from, to) are unavailable (to = checkout day). */
export type BlockedRange = { from: string; to: string };

/**
 * Blocked date ranges per room slug, used to disable dates in the public
 * booking calendar. Includes manual admin blocks (kind "block") and any
 * confirmed bookings. Past ranges are dropped. Falls back to {} (nothing
 * blocked) when the DB isn't configured.
 */
export const getBlockedRanges = cache(
  async (): Promise<Record<string, BlockedRange[]>> => {
    if (!isDbConfigured()) return {};
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      const rows = await db
        .select({
          slug: roomsTable.slug,
          from: bookingsTable.checkIn,
          to: bookingsTable.checkOut,
        })
        .from(bookingsTable)
        .innerJoin(roomsTable, eq(bookingsTable.roomId, roomsTable.id))
        .where(
          and(
            or(
              eq(bookingsTable.kind, "block"),
              eq(bookingsTable.status, "confirmed")
            ),
            gte(bookingsTable.checkOut, todayKey)
          )
        );
      const map: Record<string, BlockedRange[]> = {};
      for (const r of rows) {
        (map[r.slug] ??= []).push({ from: r.from, to: r.to });
      }
      return map;
    } catch {
      return {};
    }
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

/* ── Brand + contact (resolved, with derived phone/whatsapp links) ──── */
/**
 * The admin panel only stores raw phone digits and a handful of links.
 * The public components, however, expect the same fully-derived shape that
 * `site-config` exposes (e164 numbers, `tel:` links, pre-filled WhatsApp
 * deep links). These resolvers rebuild that shape from whatever the admin
 * saved, falling back to `site-config` field-by-field.
 */
const WHATSAPP_MESSAGE =
  "Jai Shri Krishna, I'd like to book a stay at Shri Radha Villa Stay. Please share availability and details.";

function toE164(raw: string): string {
  const d = (raw ?? "").replace(/\D/g, "");
  if (!d) return "";
  return d.startsWith("91") ? `+${d}` : `+91${d}`;
}

function waLink(raw: string): string {
  const e = toE164(raw).replace("+", "");
  return e
    ? `https://wa.me/${e}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : "#";
}

export type BrandView = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  intro: string;
  templeWalkTime: string;
  logo: string | null;
};

export type ContactView = {
  phones: {
    primary: string;
    secondary: string;
    e164Primary: string;
    e164Secondary: string;
    telPrimary: string;
    telSecondary: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    full: string;
    lat: number | null;
    lng: number | null;
  };
  links: {
    instagram: string;
    instagramHandle: string;
    facebook: string;
    whatsappPrimary: string;
    whatsappSecondary: string;
    mapsEmbed: string;
    mapsDirections: string;
  };
};

export type Faq = { q: string; a: string };

export const getBrand = cache(async (): Promise<BrandView> => {
  const fallback: BrandView = {
    name: siteConfig.name,
    shortName: siteConfig.shortName,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    intro: siteConfig.intro,
    templeWalkTime: siteConfig.templeWalkTime,
    logo: siteConfig.logo,
  };
  const raw = await getContent<Partial<BrandView>>("brand", fallback);
  return { ...fallback, ...raw };
});

export const getContact = cache(async (): Promise<ContactView> => {
  type StoredContact = {
    phones?: { primary?: string; secondary?: string };
    address?: Partial<ContactView["address"]>;
    links?: {
      instagram?: string;
      instagramHandle?: string;
      facebook?: string;
      mapsEmbed?: string;
      mapsDirections?: string;
    };
  };
  const fallback: StoredContact = {
    phones: {
      primary: siteConfig.phones.primary,
      secondary: siteConfig.phones.secondary,
    },
    address: siteConfig.address,
    links: {
      instagram: siteConfig.links.instagram,
      instagramHandle: siteConfig.links.instagramHandle,
      facebook: siteConfig.links.facebook,
      mapsEmbed: siteConfig.links.mapsEmbed,
      mapsDirections: siteConfig.links.mapsDirections,
    },
  };
  const raw = await getContent<StoredContact>("contact", fallback);
  const primary = raw.phones?.primary ?? "";
  const secondary = raw.phones?.secondary ?? "";
  return {
    phones: {
      primary,
      secondary,
      e164Primary: toE164(primary),
      e164Secondary: toE164(secondary),
      telPrimary: `tel:${toE164(primary)}`,
      telSecondary: `tel:${toE164(secondary)}`,
    },
    address: { ...siteConfig.address, ...raw.address },
    links: {
      instagram: raw.links?.instagram ?? siteConfig.links.instagram,
      instagramHandle:
        raw.links?.instagramHandle ?? siteConfig.links.instagramHandle,
      facebook: raw.links?.facebook ?? siteConfig.links.facebook,
      whatsappPrimary: waLink(primary),
      whatsappSecondary: waLink(secondary),
      mapsEmbed: raw.links?.mapsEmbed ?? siteConfig.links.mapsEmbed,
      mapsDirections:
        raw.links?.mapsDirections ?? siteConfig.links.mapsDirections,
    },
  };
});

/* ── FAQs + testimonials ────────────────────────────────────────────── */
export const getFaqs = cache(async (): Promise<Faq[]> => {
  return getContent<Faq[]>("faqs", [...defaultFaqs]);
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  return getContent<Testimonial[]>("testimonials", [...siteConfig.testimonials]);
});
