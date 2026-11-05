/**
 * Uploads every local photo used by rooms and the gallery (`/images/...`
 * paths in lib/site-config.ts) to Vercel Blob and records the resulting URLs
 * in `lib/blob-images.json` ({ "/images/x.webp": "https://….public.blob.vercel-storage.com/…" }).
 *
 * `scripts/update-rooms-2026-11.ts` then stores those Blob URLs in the
 * database. Re-running is safe: already-uploaded paths are skipped (pass
 * `--force` to re-upload everything).
 *
 *   npx tsx scripts/upload-photos-blob.ts
 */
import "./load-env";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";

import { siteConfig, galleryImages } from "../lib/site-config";

const MAP_FILE = path.join(process.cwd(), "lib/blob-images.json");
const FORCE = process.argv.includes("--force");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL_OIDC_TOKEN) {
    throw new Error("No Blob credentials: set BLOB_READ_WRITE_TOKEN or pull a Vercel env with an OIDC token");
  }

  const map: Record<string, string> = existsSync(MAP_FILE)
    ? JSON.parse(await readFile(MAP_FILE, "utf8"))
    : {};

  const paths = new Set<string>();
  for (const room of siteConfig.rooms) [room.image, ...room.gallery].forEach((p) => paths.add(p));
  for (const g of galleryImages) paths.add(g.src);
  paths.add("/images/building.jpg");

  const local = [...paths].filter((p) => p.startsWith("/images/"));
  console.log(`${local.length} photos to check`);

  for (const p of local) {
    if (map[p] && !FORCE) continue;
    const file = path.join(process.cwd(), "public", p);
    if (!existsSync(file)) {
      console.warn(`  missing on disk, skipped: ${p}`);
      continue;
    }
    // /images/rooms/madhuvan/01.webp → site/rooms/madhuvan/01.webp
    const pathname = `site/${p.replace(/^\/images\//, "")}`;
    const contentType = MIME[path.extname(p).toLowerCase()] ?? "application/octet-stream";
    const blob = await put(pathname, await readFile(file), {
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
      // Photos never change at the same URL — let the CDN and browsers keep them for a year.
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    map[p] = blob.url;
    console.log(`  ✓ ${p}`);
    // Save after every upload so an interrupted run can resume.
    await writeFile(MAP_FILE, JSON.stringify(map, null, 2) + "\n");
  }

  await writeFile(MAP_FILE, JSON.stringify(map, null, 2) + "\n");
  console.log(`done — ${Object.keys(map).length} photos mapped in lib/blob-images.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
