import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { z } from "zod";
import {
  markBookingPaidByOrderId,
  markBookingPaymentFailedByOrderId,
  getBookingById,
} from "@/lib/db/queries";
import { notifyAdminsQuickly, shortDate } from "@/lib/push";

const schema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Payment is not configured" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      parsed.data;

    // Verify signature. Which booking this is for is resolved from the
    // server-stored order id — never from the request body — so the caller
    // cannot mark someone else's booking paid.
    const generated = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated !== razorpay_signature) {
      await markBookingPaymentFailedByOrderId(razorpay_order_id);
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const booking = await markBookingPaidByOrderId(
      razorpay_order_id,
      razorpay_payment_id
    );
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found for this order" },
        { status: 404 }
      );
    }

    // The booking is now confirmed, so its dates must be blocked on the
    // public calendar immediately (not only at the next hourly revalidate).
    revalidatePath("/booking");
    revalidatePath("/rooms/[slug]", "page");

    const full = await getBookingById(booking.id).catch(() => null);
    await notifyAdminsQuickly({
      title: booking.clash
        ? "⚠️ Advance paid but dates are already taken — call the guest"
        : "✅ New booking — advance paid",
      body: full
        ? `${full.booking.guestName || "A guest"} · ${full.roomName ?? "Room"} · ${shortDate(full.booking.checkIn)} → ${shortDate(full.booking.checkOut)}${full.booking.guests ? ` · ${full.booking.guests}` : ""}`
        : `Booking #${booking.id} — advance received`,
      url: "/admin/bookings/",
      tag: `booking-${booking.id}`,
    });

    return NextResponse.json({ ok: true, bookingId: booking.id, clash: booking.clash });
  } catch (err) {
    console.error("[verify-payment]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
