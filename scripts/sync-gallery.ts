/**
 * Makes the database gallery match the curated list in lib/site-config.ts
 * (`galleryImages`), using the Vercel Blob URLs from lib/blob-images.json.
 *
 * Rows whose photo is not in the curated list — e.g. the original seed's
 * "PLACEHOLDER PHOTO" images — are removed. A JSON backup of every row is
 * written first. Dry run by default; pass `--apply` to write.
 *
 *   npx tsx scripts/sync-gallery.ts            # preview
 *   npx tsx scripts/sync-gallery.ts --apply    # write
 */
import "./load-env";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { galleryImages } from "../lib/site-config";

const APPLY = process.argv.includes("--apply");
const MAP_FILE = path.join(process.cwd(), "lib/blob-images.json");
const blobUrls: Record<string, string> = existsSync(MAP_FILE)
  ? JSON.parse(readFileSync(MAP_FILE, "utf8"))
  : {};

async function main() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);

  const rows = (await sql`select * from gallery_images order by sort_order, id`) as {
    id: number;
    src: string;
  }[];
  const want = galleryImages.map((g, i) => ({ ...g, src: blobUrls[g.src] ?? g.src, sortOrder: i }));
  const wanted = new Set(want.map((w) => w.src));
  const stale = rows.filter((r) => !wanted.has(r.src));
  const existing = new Map(rows.filter((r) => wanted.has(r.src)).map((r) => [r.src, r.id]));
  const toInsert = want.filter((w) => !existing.has(w.src));

  console.log(APPLY ? "APPLYING changes" : "DRY RUN (pass --apply to write)");
  console.log(`remove ${stale.length}:`);
  for (const r of stale) console.log(`  - #${r.id} ${r.src}`);
  console.log(`update ${existing.size}, insert ${toInsert.length}`);
  if (!APPLY) return;

  mkdirSync("backups", { recursive: true });
  const backup = path.join("backups", `gallery-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  writeFileSync(backup, JSON.stringify(rows, null, 2));
  console.log(`backup written to ${backup}`);

  for (const r of stale) await sql`delete from gallery_images where id = ${r.id}`;
  for (const w of want) {
    const id = existing.get(w.src);
    if (id) {
      await sql`update gallery_images set alt = ${w.alt}, category = ${w.category}, sort_order = ${w.sortOrder} where id = ${id}`;
    } else {
      await sql`insert into gallery_images (src, alt, category, sort_order) values (${w.src}, ${w.alt}, ${w.category}, ${w.sortOrder})`;
    }
  }
  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
