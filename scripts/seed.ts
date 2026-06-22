/**
 * Seeds the database from the current `lib/site-config.ts` content and
 * creates the initial admin account from ADMIN_EMAIL / ADMIN_PASSWORD.
 *
 * Idempotent: safe to re-run. Existing rooms (by slug), content blocks
 * (by key) and the admin (by email) are left untouched; the gallery is
 * only seeded when empty.
 *
 * Run with: `npm run db:seed`
 */
import "./load-env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";

import * as schema from "../lib/db/schema";
import {
  siteConfig,
  galleryImages,
  attractions,
  about,
  faqs,
  bookingPerks,
} from "../lib/site-config";

const { rooms, galleryImages: galleryTable, siteContent, adminUsers } = schema;

/** Parse "₹1,500" → 1500 (or null). */
function parsePrice(s: string): number | null {
  const n = parseInt(s.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

async function main() {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED;
  if (!url) {
    console.error("✗ DATABASE_URL not set. Run `vercel env pull .env.local`.");
    process.exit(1);
  }
  const db = drizzle(neon(url), { schema });

  /* ── Rooms ──────────────────────────────────────────────────────── */
  console.log("→ Seeding rooms…");
  let order = 0;
  for (const r of siteConfig.rooms) {
    await db
      .insert(rooms)
      .values({
        slug: r.slug,
        name: r.name,
        image: r.image,
        alt: r.alt,
        blurb: r.blurb,
        features: [...r.features],
        guests: r.guests,
        price: r.price,
        priceNight: r.priceNight,
        priceAmount: parsePrice(r.priceNight),
        tagline: r.tagline,
        bed: r.bed,
        size: r.size,
        gallery: [...r.gallery],
        amenities: [...r.amenities],
        highlights: [...r.highlights],
        sortOrder: order++,
        published: true,
      })
      .onConflictDoNothing({ target: rooms.slug });
  }

  /* ── Gallery (only if empty) ────────────────────────────────────── */
  const existingGallery = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(galleryTable);
  if ((existingGallery[0]?.count ?? 0) === 0) {
    console.log("→ Seeding gallery images…");
    await db.insert(galleryTable).values(
      galleryImages.map((g, i) => ({
        src: g.src,
        alt: g.alt,
        category: g.category,
        sortOrder: i,
      }))
    );
  } else {
    console.log("• Gallery already has rows — skipping.");
  }

  /* ── Editable site content blocks ───────────────────────────────── */
  console.log("→ Seeding site content…");
  const contentBlocks: Record<string, unknown> = {
    brand: {
      name: siteConfig.name,
      shortName: siteConfig.shortName,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      intro: siteConfig.intro,
      templeWalkTime: siteConfig.templeWalkTime,
      logo: siteConfig.logo,
    },
    contact: {
      address: siteConfig.address,
      phones: {
        primary: siteConfig.phones.primary,
        secondary: siteConfig.phones.secondary,
      },
      links: siteConfig.links,
    },
    quickFacts: siteConfig.quickFacts,
    aboutFeatures: siteConfig.aboutFeatures,
    facilities: siteConfig.facilities,
    highlights: siteConfig.highlights,
    divineEnergy: siteConfig.divineEnergy,
    nearby: siteConfig.nearby,
    testimonials: siteConfig.testimonials,
    attractions,
    about,
    faqs,
    bookingPerks,
  };
  for (const [key, value] of Object.entries(contentBlocks)) {
    await db
      .insert(siteContent)
      .values({ key, value })
      .onConflictDoNothing({ target: siteContent.key });
  }

  /* ── Admin user ─────────────────────────────────────────────────── */
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    console.log(`→ Creating admin user (${email})…`);
    const hash = await bcrypt.hash(password, 10);
    await db
      .insert(adminUsers)
      .values({ email: email.toLowerCase().trim(), passwordHash: hash })
      .onConflictDoNothing({ target: adminUsers.email });
  } else {
    console.log("• ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user.");
  }

  console.log("✓ Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
