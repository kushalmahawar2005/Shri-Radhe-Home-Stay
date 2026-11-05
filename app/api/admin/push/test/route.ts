import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { notifyAdmins } from "@/lib/push";

export const runtime = "nodejs";

/** Sends a test notification to every admin device. */
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sent = await notifyAdmins({
    title: "🔔 Notifications are working",
    body: "You will get an alert here for every new booking.",
    url: "/admin/",
    tag: "test",
  });
  return NextResponse.json({ ok: true, sent });
}
