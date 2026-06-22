/**
 * ────────────────────────────────────────────────────────────────────────
 *  Database schema (Neon Postgres via Drizzle ORM).
 *
 *  Tables:
 *   - rooms          : every room shown on the site (admin add/edit/remove)
 *   - bookings       : booking requests + manual date blocks (availability)
 *   - messages       : contact-form submissions (admin inbox)
 *   - gallery_images : uploaded photos for the /gallery grid
 *   - site_content   : editable text blocks keyed by section name
 *   - admin_users    : panel login accounts
 * ────────────────────────────────────────────────────────────────────────
 */
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  date,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

/* ── Rooms ──────────────────────────────────────────────────────────── */
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  image: text("image").notNull().default(""),
  alt: text("alt").notNull().default(""),
  blurb: text("blurb").notNull().default(""),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  guests: text("guests").notNull().default(""),
  price: text("price").notNull().default("On Request"),
  priceNight: text("price_night").notNull().default(""),
  // Numeric per-night rate (in ₹) for any future calculations; nullable.
  priceAmount: integer("price_amount"),
  tagline: text("tagline").notNull().default(""),
  bed: text("bed").notNull().default(""),
  size: text("size").notNull().default(""),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ── Bookings & manual availability blocks ──────────────────────────── */
// kind:   "request" = guest/admin booking request | "block" = manual block
// status: "pending" | "confirmed" | "cancelled"
// A room is unavailable for dates covered by a "block" or a "confirmed" row.
export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    roomId: integer("room_id").references(() => rooms.id, {
      onDelete: "cascade",
    }),
    guestName: text("guest_name").notNull().default(""),
    phone: text("phone").notNull().default(""),
    email: text("email").notNull().default(""),
    checkIn: date("check_in").notNull(),
    checkOut: date("check_out").notNull(),
    guests: text("guests").notNull().default(""),
    notes: text("notes").notNull().default(""),
    status: text("status").notNull().default("pending"),
    kind: text("kind").notNull().default("request"),
    source: text("source").notNull().default("web"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    roomDateIdx: index("bookings_room_date_idx").on(t.roomId, t.checkIn, t.checkOut),
    statusIdx: index("bookings_status_idx").on(t.status),
  })
);

/* ── Contact-form messages ──────────────────────────────────────────── */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("new"), // new | read | archived
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ── Gallery images ─────────────────────────────────────────────────── */
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  src: text("src").notNull(),
  alt: text("alt").notNull().default(""),
  category: text("category").notNull().default("Rooms"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ── Editable site content (singleton blocks keyed by section) ──────── */
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ── Admin users ────────────────────────────────────────────────────── */
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ── Inferred types ─────────────────────────────────────────────────── */
export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type SiteContentRow = typeof siteContent.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
