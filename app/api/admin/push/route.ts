import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { isPushConfigured, removeSubscription, saveSubscription } from "@/lib/push";

export const runtime = "nodejs";

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }),
});

/** Save this device so it receives booking notifications. */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isPushConfigured()) {
    return NextResponse.json({ error: "Notifications are not set up on the server yet." }, { status: 503 });
  }
  const parsed = subscriptionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });

  try {
    await saveSubscription({
      ...parsed.data,
      adminEmail: session.email,
      userAgent: req.headers.get("user-agent") ?? "",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[push subscribe]", err);
    return NextResponse.json({ error: "Could not save this device. Please try again." }, { status: 500 });
  }
}

/** Stop notifications on this device. */
export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { endpoint?: string } | null;
  if (!body?.endpoint) return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
  await removeSubscription(body.endpoint).catch(() => {});
  return NextResponse.json({ ok: true });
}
