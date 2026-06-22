/**
 * Applies pending SQL migrations (from ./drizzle) to the database.
 * Run with: `npm run db:migrate`
 */
import "./load-env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

async function main() {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  if (!url) {
    console.error(
      "✗ DATABASE_URL is not set. Run `vercel env pull .env.local` first."
    );
    process.exit(1);
  }

  const db = drizzle(neon(url));
  console.log("→ Running migrations…");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ Migrations applied.");
  process.exit(0);
}

main().catch((err) => {
  console.error("✗ Migration failed:", err);
  process.exit(1);
});
