"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarCheck, MessageCircle, Check } from "lucide-react";
import { siteConfig, type Room } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import {
  DateRangePicker,
  type BlockedRange,
} from "@/components/ui/date-range-picker";
import { BLUR_DATA_URL, cn } from "@/lib/utils";
import { submitBookingRequest } from "@/app/(site)/booking/actions";

function overlaps(from: string, to: string, blocked: BlockedRange[]) {
  if (!from || !to) return false;
  return blocked.some((b) => b.from < to && b.to > from);
}

export function BookingForm({
  rooms = siteConfig.rooms,
  blockedRanges = {},
  brandName = siteConfig.name,
  whatsappNumber = siteConfig.phones.e164Primary.replace("+", ""),
}: {
  rooms?: Room[];
  blockedRanges?: Record<string, BlockedRange[]>;
  brandName?: string;
  /** Bare e164 digits (no +) for WhatsApp deep links. */
  whatsappNumber?: string;
}) {
  const router = useRouter();
  const search = useSearchParams();

  const [room, setRoom] = useState(
    search.get("room") ?? rooms[0].slug
  );
  const [checkIn, setCheckIn] = useState(search.get("checkin") ?? "");
  const [checkOut, setCheckOut] = useState(search.get("checkout") ?? "");
  const [guests, setGuests] = useState(search.get("guests") ?? "2 Adults");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentMode, setPaymentMode] = useState("pay_at_homestay");

  const selectedRoom =
    rooms.find((r) => r.slug === room) ?? rooms[0];

  const blockedForRoom = blockedRanges[room] ?? [];

  // If the guest switches to a room whose blocks clash with the dates they
  // already chose, clear those dates so they can't request an unavailable stay.
  useEffect(() => {
    if (overlaps(checkIn, checkOut, blockedForRoom)) {
      setCheckIn("");
      setCheckOut("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  const inputCls =
    "w-full rounded-lg border border-gold/40 bg-cream-light px-4 py-2.5 text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

  function buildSummaryParams(bookingId?: number) {
    const id =
      bookingId != null
        ? `SRH-${String(bookingId).padStart(6, "0")}`
        : "SRH-PENDING";
    return new URLSearchParams({
      id,
      name,
      phone,
      room: selectedRoom.name,
      checkin: checkIn,
      checkout: checkOut,
      guests,
      paymentMode,
      total: totalPrice > 0 ? totalPrice.toString() : "",
    });
  }

  const waMessage =
    `Jai Shri Krishna! I'd like to book a stay at ${brandName}.` +
    `\n\nRoom: ${selectedRoom.name} (${selectedRoom.priceNight}/night)` +
    `\nCheck-in: ${checkIn || "—"}\nCheck-out: ${checkOut || "—"}` +
    `\nGuests: ${guests}\nName: ${name || "—"}\nPhone: ${phone || "—"}` +
    (notes ? `\nNotes: ${notes}` : "");

  const [dateError, setDateError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      setDateError("Please choose your check-in and check-out dates.");
      return;
    }
    if (overlaps(checkIn, checkOut, blockedForRoom)) {
      setDateError(
        "Some of those dates are already booked. Please pick another range."
      );
      return;
    }
    setDateError("");
    setSubmitting(true);

    try {
      if (paymentMode === "online") {
        // Razorpay flow
        const res = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomSlug: room,
            checkIn,
            checkOut,
            guests,
            name,
            phone,
            email,
            notes,
          }),
        });
        
        const data = await res.json();
        if (!res.ok) {
          setDateError(data.error || "Failed to create order");
          setSubmitting(false);
          return;
        }

        const loadScript = () => {
          return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const loaded = await loadScript();
        if (!loaded) {
          setDateError("Failed to load Razorpay SDK. Are you online?");
          setSubmitting(false);
          return;
        }

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: brandName,
          description: `Advance for ${selectedRoom.name}`,
          order_id: data.orderId,
          handler: async function (response: any) {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.ok) {
              const params = buildSummaryParams(
                verifyData.bookingId ?? data.bookingId
              );
              params.set("paymentStatus", "paid");
              router.push(`/booking/success?${params.toString()}`);
            } else {
              setDateError("Payment verification failed.");
              setSubmitting(false);
            }
          },
          prefill: {
            name: name,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#059669",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setDateError(response.error.description);
          setSubmitting(false);
        });
        rzp.open();
        return; // wait for handler
      } else {
        // Pay at homestay flow
        const result = await submitBookingRequest({
          roomSlug: room,
          checkIn,
          checkOut,
          guests,
          name,
          phone,
          email,
          notes,
          paymentMode,
        });

        if (!result.ok) {
          const friendly =
            result.error === "invalid"
              ? "Please check your details and try again."
              : "We couldn't submit your request just now. Please call or message us on WhatsApp and we'll book it for you.";
          setDateError(friendly);
          setSubmitting(false);
          return;
        }
        
        const params = buildSummaryParams(result.bookingId);
        router.push(`/booking/success?${params.toString()}`);
      }
    } catch (err) {
      setDateError("An unexpected error occurred.");
      setSubmitting(false);
    }
  }

  // Calculate nights
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Get numeric price from priceNight string like "₹2,500"
  const numericPrice = parseInt(selectedRoom.priceNight.replace(/[^0-9]/g, ""), 10) || 0;
  const totalPrice = nights * numericPrice;

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      {/* LEFT — details */}
      <div className="flex flex-col gap-8">
        {/* dates */}
        <div className="rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-soft">
          <h2 className="font-serif text-xl font-semibold text-emerald">
            Stay Dates
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-ink/80">
                Dates of Stay
              </span>
              <DateRangePicker
                checkIn={checkIn}
                checkOut={checkOut}
                blocked={blockedForRoom}
                onChange={(ci, co) => {
                  setCheckIn(ci);
                  setCheckOut(co);
                }}
              />
            </div>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink/80">
              Guests
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className={inputCls}
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>2 Adults, 1 Child</option>
                <option>3 Adults</option>
                <option>4+ Guests</option>
              </select>
            </label>
          </div>
          {dateError ? (
            <p className="mt-3 text-xs font-medium text-red-600">{dateError}</p>
          ) : (
            <p className="mt-3 text-xs text-ink/50">
              Greyed-out dates are already booked for{" "}
              <span className="font-medium text-ink/70">
                {selectedRoom.name}
              </span>
              .
            </p>
          )}
        </div>

        {/* room selection */}
        <div className="rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-soft">
          <h2 className="font-serif text-xl font-semibold text-emerald">
            Select Room Type
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {rooms.map((r) => {
              const isSelected = room === r.slug;
              const capacity = r.features.find((f) => /guest/i.test(f));
              return (
                <button
                  key={r.slug}
                  type="button"
                  onClick={() => setRoom(r.slug)}
                  aria-pressed={isSelected}
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-xl border bg-cream-light text-left transition-all duration-200",
                    isSelected
                      ? "border-emerald shadow-card ring-2 ring-emerald/30"
                      : "border-gold/30 hover:border-gold hover:shadow-soft"
                  )}
                >
                  <figure className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 20vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isSelected && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald text-cream-light shadow-soft">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                    {capacity && (
                      <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-medium text-cream-light backdrop-blur-sm">
                        {capacity}
                      </span>
                    )}
                  </figure>
                  <div className="flex flex-1 flex-col p-3">
                    <p className="font-serif text-base font-semibold text-ink">
                      {r.name}
                    </p>
                    <p className="mt-auto pt-1 text-sm font-semibold text-gold-dark">
                      {r.priceNight}{" "}
                      <span className="font-normal text-ink/50">/ night</span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* guest info */}
        <div className="rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-soft">
          <h2 className="font-serif text-xl font-semibold text-emerald">
            Your Information
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink/80">
              Full Name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
                placeholder="Your name"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink/80">
              Phone Number
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
                placeholder="Mobile number"
              />
            </label>
          </div>
          <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium text-ink/80">
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="you@example.com"
            />
          </label>
          <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium text-ink/80">
            Additional Notes
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputCls}
              placeholder="Any special request, arrival time, taxi assistance…"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-soft">
          <h2 className="font-serif text-xl font-semibold text-emerald">
            Payment Option
          </h2>
          <div className="mt-4 grid gap-3">
            <label className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all",
              paymentMode === "online"
                ? "border-emerald bg-emerald/5 shadow-card ring-2 ring-emerald/30"
                : "border-gold/30 hover:border-gold"
            )}>
              <input
                type="radio"
                name="paymentMode"
                value="online"
                checked={paymentMode === "online"}
                onChange={() => setPaymentMode("online")}
                className="accent-emerald"
              />
              <div>
                <p className="font-semibold text-ink">Pay ₹{siteConfig.advanceAmount} Advance (Online)</p>
                <p className="text-xs text-ink/60">Confirm your booking instantly via Razorpay. Remaining amount at check-in.</p>
              </div>
            </label>
            <label className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all",
              paymentMode === "pay_at_homestay"
                ? "border-emerald bg-emerald/5 shadow-card ring-2 ring-emerald/30"
                : "border-gold/30 hover:border-gold"
            )}>
              <input
                type="radio"
                name="paymentMode"
                value="pay_at_homestay"
                checked={paymentMode === "pay_at_homestay"}
                onChange={() => setPaymentMode("pay_at_homestay")}
                className="accent-emerald"
              />
              <div>
                <p className="font-semibold text-ink">Pay at Homestay</p>
                <p className="text-xs text-ink/60">Request a booking and pay when you arrive. Subject to confirmation.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
            {submitting ? "Processing..." : <><CalendarCheck className="h-4 w-4" /> Book Now</>}
          </Button>
          <Button asChild variant="gold" className="flex-1">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                waMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> Book on WhatsApp
            </a>
          </Button>
        </div>
        <p className="text-center text-xs text-ink/50">
          Choose <span className="font-medium text-ink/70">Pay at Homestay</span>{" "}
          to request a booking with no advance, or pay a ₹
          {siteConfig.advanceAmount} advance online to confirm instantly. We
          &apos;ll always reach out over a call or WhatsApp to finalise details.
        </p>
      </div>

      {/* RIGHT — live summary */}
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-card">
          <h2 className="font-serif text-xl font-semibold text-emerald">
            Your Booking Summary
          </h2>
          <figure className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl border border-gold/30">
            <Image
              src={selectedRoom.image}
              alt={selectedRoom.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover"
            />
          </figure>

          <dl className="mt-5 space-y-3 text-sm">
            <Row label="Room" value={selectedRoom.name} />
            <Row label="Rate" value={`${selectedRoom.priceNight} / night`} />
            <Row label="Check In" value={checkIn || "—"} />
            <Row label="Check Out" value={checkOut || "—"} />
            <Row label="Guests" value={guests} />
            <Row label="Nights" value={nights > 0 ? `${nights} Night${nights > 1 ? 's' : ''}` : "—"} />
            <Row label="Total" value={totalPrice > 0 ? `₹${totalPrice.toLocaleString('en-IN')}` : "—"} highlight />
          </dl>

          <div className="mt-5 border-t border-gold/30 pt-4">
            <h3 className="font-serif text-base font-semibold text-emerald">
              Why Book Direct?
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink/75">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald" /> Best price, no
                middlemen
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald" /> Flexible check-in
                assistance
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald" /> Direct support before
                & during stay
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between gap-3", highlight && "border-t border-gold/30 pt-3 mt-1")}>
      <dt className={cn("text-ink/55", highlight && "font-semibold text-ink")}>{label}</dt>
      <dd className={cn("font-medium text-ink", highlight && "text-lg text-emerald")}>{value}</dd>
    </div>
  );
}
