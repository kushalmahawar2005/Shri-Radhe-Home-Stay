import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { isDbConfigured } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";
import {
  createBooking,
  getRoomIdBySlug,
  isRoomAvailable,
  updateBookingPayment,
} from "@/lib/db/queries";

const schema = z.object({
  roomSlug: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.string().default(""),
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().default(""),
  notes: z.string().default(""),
});

export async function POST(req: NextRequest) {
  try {
    // Razorpay keys are read lazily (not at module load) so an unconfigured
    // deploy returns a clear message instead of crashing the route.
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error:
            "Online payment isn't set up yet. Please choose Pay at Villa or contact us.",
        },
        { status: 503 }
      );
    }

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const data = parsed.data;

    // The advance amount is ALWAYS computed on the server — never taken from
    // the client — so the charged amount can't be tampered with.
    const amount = siteConfig.advanceAmount * 100; // in paise

    // Check availability
    const roomId = await getRoomIdBySlug(data.roomSlug);
    if (roomId) {
      const available = await isRoomAvailable(
        roomId,
        data.checkIn,
        data.checkOut
      );
      if (!available) {
        return NextResponse.json(
          { error: "Room not available for selected dates", available: false },
          { status: 409 }
        );
      }
    }

    // Create booking in DB first (pending payment)
    const booking = await createBooking({
      roomId: roomId ?? null,
      guestName: data.name,
      phone: data.phone,
      email: data.email,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      notes: data.notes,
      status: "pending",
      kind: "request",
      source: "web",
      paymentMode: "online",
      paymentStatus: "pending",
      amount,
    });

    // Create Razorpay order
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `booking_${booking.id}`,
      notes: {
        bookingId: String(booking.id),
        guestName: data.name,
        phone: data.phone,
        room: data.roomSlug,
      },
    });

    // Save Razorpay order ID to booking
    await updateBookingPayment(booking.id, {
      razorpayOrderId: order.id,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? keyId,
    });
  } catch (err) {
    console.error("[create-order]", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
