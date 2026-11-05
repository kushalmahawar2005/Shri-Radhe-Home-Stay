/**
 * Web Push notifications for the admin app.
 *
 * Needs NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY and VAPID_SUBJECT
 * (generate with `npx web-push generate-vapid-keys`). When they are missing,
 * every function here quietly does nothing so bookings never fail because
 * of notifications.
 */
import "server-only";
import webpush from "web-push";
import { eq, inArray } from "drizzle-orm";

import { db, isDbConfigured } from "@/lib/db";
import { pushSubscriptions } from "@/lib/db/schema";

export type PushPayload = {
  title: string;
  body: string;
  /** Admin page to open when the notification is tapped. */
  url?: string;
  /** Notifications with the same tag replace each other. */
  tag?: string;
};

let configured: boolean | null = null;

export function isPushConfigured(): boolean {
  if (configured !== null) return configured;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return (configured = false);
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:admin@shreeradhehomestay.in",
    publicKey,
    privateKey,
  );
  return (configured = true);
}

export async function saveSubscription(sub: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  adminEmail: string;
  userAgent: string;
}) {
  await db
    .insert(pushSubscriptions)
    .values({
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      adminEmail: sub.adminEmail,
      userAgent: sub.userAgent.slice(0, 300),
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: { p256dh: sub.keys.p256dh, auth: sub.keys.auth, adminEmail: sub.adminEmail },
    });
}

export async function removeSubscription(endpoint: string) {
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
}

export async function countSubscriptions(): Promise<number> {
  if (!isDbConfigured()) return 0;
  try {
    const rows = await db.select({ id: pushSubscriptions.id }).from(pushSubscriptions);
    return rows.length;
  } catch {
    return 0;
  }
}

/**
 * Sends a notification to every admin device. Never throws — returns how
 * many devices received it. Expired subscriptions are cleaned up.
 */
export async function notifyAdmins(payload: PushPayload): Promise<number> {
  if (!isPushConfigured() || !isDbConfigured()) return 0;
  try {
    const subs = await db.select().from(pushSubscriptions);
    if (!subs.length) return 0;

    const body = JSON.stringify(payload);
    const gone: number[] = [];
    let sent = 0;
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            body,
            { TTL: 60 * 60 * 24, urgency: "high" },
          );
          sent++;
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode;
          if (status === 404 || status === 410) gone.push(s.id);
          else console.error("Push failed:", status, (err as Error).message);
        }
      }),
    );
    if (gone.length) await db.delete(pushSubscriptions).where(inArray(pushSubscriptions.id, gone));
    return sent;
  } catch (err) {
    console.error("notifyAdmins failed:", err);
    return 0;
  }
}

/**
 * Like notifyAdmins but gives up after `ms` so a slow push service never
 * delays the guest's booking confirmation.
 */
export async function notifyAdminsQuickly(payload: PushPayload, ms = 3000) {
  await Promise.race([notifyAdmins(payload), new Promise((r) => setTimeout(r, ms))]);
}

/** Short human date, e.g. "11 Nov". */
export function shortDate(d: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(d)
    ? new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : d;
}
