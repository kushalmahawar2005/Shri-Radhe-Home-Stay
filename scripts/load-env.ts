/**
 * Loads environment variables for CLI scripts, preferring `.env.local`
 * (where `vercel env pull` writes) and falling back to `.env`.
 * Import this FIRST in any script that needs DATABASE_URL etc.
 */
import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
for (const file of [".env.local", ".env"]) {
  const path = resolve(root, file);
  if (existsSync(path)) config({ path, override: false });
}
