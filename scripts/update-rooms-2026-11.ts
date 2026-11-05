/**
 * One-off content update (Nov 2026): the owners renamed the three original
 * rooms, re-photographed one of them and added four new rooms.
 *
 *   deluxe  → makhan-chor  (new photos)
 *   family  → bal-gopal
 *   premium → radha-rani
 *   + madhuvan, radhika-rajkunj, kishori-kripa, kanupriya (new)
 *
 * Existing rows are updated IN PLACE so their ids — and every booking and
 * date block that points at them — stay intact. New rooms are inserted.
 * The gallery loses the photos of the old Deluxe room and gains the new
 * room and common-area photos.
 *
 * Idempotent. Dry run by default; pass `--apply` to write.
 *   npx tsx scripts/update-rooms-2026-11.ts           # preview
 *   npx tsx scripts/update-rooms-2026-11.ts --apply   # write
 */
import "./load-env";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, inArray } from "drizzle-orm";

import * as schema from "../lib/db/schema";
import { siteConfig, galleryImages } from "../lib/site-config";

const APPLY = process.argv.includes("--apply");

/** Local `/images/...` path → Vercel Blob URL (written by upload-photos-blob.ts). */
const MAP_FILE = path.join(process.cwd(), "lib/blob-images.json");
const blobUrls: Record<string, string> = existsSync(MAP_FILE)
  ? JSON.parse(readFileSync(MAP_FILE, "utf8"))
  : {};
const toBlob = (src: string) => blobUrls[src] ?? src;
const RENAMED: Record<string, string> = {
  deluxe: "makhan-chor",
  family: "bal-gopal",
  premium: "radha-rani",
};
/** Photos of the old Deluxe room, which no longer looks like this. */
const RETIRED_GALLERY = [
  "/images/01.jpg",
  "/images/02.jpg",
  "/images/03.jpg",
  "/images/room-deluxe.jpg",
  "/images/room-deluxe-enhanced.webp",
];

function parsePrice(s: string): number | null {
  const n = Number(s.replace(/[^0-9]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function main() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const db = drizzle(neon(url), { schema });
  const { rooms, galleryImages: gallery } = schema;

  console.log(APPLY ? "APPLYING changes" : "DRY RUN (pass --apply to write)");
  const mapped = Object.keys(blobUrls).length;
  console.log(mapped ? `using ${mapped} Vercel Blob photo URLs` : "WARNING: lib/blob-images.json missing — local /images paths will be stored");

  const existing = await db.select().from(rooms);
  const bySlug = new Map(existing.map((r) => [r.slug, r]));

  for (const [index, room] of siteConfig.rooms.entries()) {
    const oldSlug = Object.keys(RENAMED).find((k) => RENAMED[k] === room.slug);
    const row = bySlug.get(room.slug) ?? (oldSlug ? bySlug.get(oldSlug) : undefined);
    const data = {
      slug: room.slug,
      name: room.name,
      image: toBlob(room.image),
      alt: room.alt,
      blurb: room.blurb,
      features: [...room.features],
      guests: room.guests,
      price: room.price,
      priceNight: room.priceNight,
      priceAmount: parsePrice(room.priceNight),
      tagline: room.tagline,
      bed: room.bed,
      size: room.size,
      gallery: room.gallery.map(toBlob),
      amenities: [...room.amenities],
      highlights: [...room.highlights],
      sortOrder: index,
      published: true,
      updatedAt: new Date(),
    };
    if (row) {
      console.log(`update #${row.id} ${row.slug} → ${room.slug} (${room.priceNight}, ${room.guests})`);
      if (APPLY) await db.update(rooms).set(data).where(eq(rooms.id, row.id));
    } else {
      console.log(`insert ${room.slug} (${room.priceNight}, ${room.guests})`);
      if (APPLY) await db.insert(rooms).values(data);
    }
  }

  const currentGallery = await db.select().from(gallery);
  const retired = currentGallery.filter((g) => RETIRED_GALLERY.includes(g.src));
  const movable = currentGallery.filter((g) => !RETIRED_GALLERY.includes(g.src) && blobUrls[g.src]);
  console.log(`gallery: point ${movable.length} existing photo(s) at Vercel Blob`);
  if (APPLY) {
    for (const g of movable) await db.update(gallery).set({ src: blobUrls[g.src] }).where(eq(gallery.id, g.id));
  }
  console.log(`gallery: remove ${retired.length} old Deluxe photo(s)`);
  if (APPLY && retired.length) {
    await db.delete(gallery).where(inArray(gallery.id, retired.map((g) => g.id)));
  }

  const have = new Set(currentGallery.flatMap((g) => [g.src, toBlob(g.src)]));
  const maxSort = Math.max(0, ...currentGallery.map((g) => g.sortOrder));
  const toAdd = galleryImages.filter(
    (g) =>
      !have.has(g.src) &&
      !have.has(toBlob(g.src)) &&
      (g.src.startsWith("/images/rooms/") || g.src === "/images/building.jpg"),
  );
  console.log(`gallery: add ${toAdd.length} new photo(s)`);
  if (APPLY && toAdd.length) {
    await db.insert(gallery).values(
      toAdd.map((g, i) => ({ src: toBlob(g.src), alt: g.alt, category: g.category, sortOrder: maxSort + 1 + i })),
    );
  }

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
