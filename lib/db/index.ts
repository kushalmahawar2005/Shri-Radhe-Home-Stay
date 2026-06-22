/**
 * Database client (Neon serverless + Drizzle).
 *
 * Initialised lazily so that `next build` does not crash when DATABASE_URL
 * is missing — it only throws if a query is actually attempted without a
 * connection string. Use `isDbConfigured()` to branch on availability.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    undefined
  );
}

export function isDbConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

let _db: NeonHttpDatabase<typeof schema> | null = null;

function createDb(): NeonHttpDatabase<typeof schema> {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Connect a Postgres (Neon) database in Vercel " +
        "and run `vercel env pull .env.local`."
    );
  }
  return drizzle(neon(url), { schema });
}

/**
 * Lazy proxy — the real Drizzle client is created on first property access,
 * so importing this module never touches the network or env at build time.
 */
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    if (!_db) _db = createDb();
    return Reflect.get(_db, prop, receiver);
  },
});

export * from "./schema";
