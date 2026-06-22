"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarCheck, MessageCircle, Check } from "lucide-react";
import { siteConfig, type Room } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { BLUR_DATA_URL, cn } from "@/lib/utils";
import { submitBookingRequest } from "@/app/(site)/booking/actions";

const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

export function BookingForm({ rooms = siteConfig.rooms }: { rooms?: Room[] }) {
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

  const selectedRoom =
    rooms.find((r) => r.slug === room) ?? rooms[0];

  const inputCls =
    "w-full rounded-lg border border-gold/40 bg-cream-light px-4 py-2.5 text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

  function buildSummaryParams() {
    const bookingId = "SRH-" + Math.floor(100000 + Math.random() * 900000);
    return new URLSearchParams({
      id: bookingId,
      name,
      phone,
      room: selectedRoom.name,
      checkin: checkIn,
      checkout: checkOut,
      guests,
    });
  }

  const waMessage =
    `Jai Shri Krishna! I'd like to book a stay at ${siteConfig.name}.` +
    `\n\nRoom: ${selectedRoom.name} (${selectedRoom.priceNight}/night)` +
    `\nCheck-in: ${checkIn || "—"}\nCheck-out: ${checkOut || "—"}` +
    `\nGuests: ${guests}\nName: ${name || "—"}\nPhone: ${phone || "—"}` +
    (notes ? `\nNotes: ${notes}` : "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = buildSummaryParams();

    // Save the request to our database (admin inbox). Non-blocking: if the
    // DB isn't configured or the save fails, we still confirm to the guest.
    try {
      await submitBookingRequest({
        roomSlug: room,
        checkIn,
        checkOut,
        guests,
        name,
        phone,
        email,
        notes,
      });
    } catch {
      /* ignore — still show confirmation */
    }

    // Optional: post to Formspree if configured (no server needed otherwise).
    if (ENDPOINT) {
      try {
        await fetch(ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: JSON.stringify({
            name,
            phone,
            email,
            room: selectedRoom.name,
            checkIn,
            checkOut,
            guests,
            notes,
          }),
        });
      } catch {
        /* ignore — still show confirmation */
      }
    }

    router.push(`/booking/success?${params.toString()}`);
  }

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
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink/80">
              Check In
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={inputCls}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink/80">
              Check Out
              <input
                type="date"
                required
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className={inputCls}
              />
            </label>
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
        </div>

        {/* room selection */}
        <div className="rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-soft">
          <h2 className="font-serif text-xl font-semibold text-emerald">
            Select Room Type
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {rooms.map((r) => (
              <button
                key={r.slug}
                type="button"
                onClick={() => setRoom(r.slug)}
                className={cn(
                  "overflow-hidden rounded-xl border-2 text-left transition-all",
                  room === r.slug
                    ? "border-emerald shadow-card"
                    : "border-gold/30 hover:border-gold"
                )}
              >
                <figure className="relative aspect-[4/3]">
                  <Image
                    src={r.image}
                    alt={r.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 20vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                  {room === r.slug && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald text-cream-light">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </figure>
                <div className="p-3">
                  <p className="font-serif text-base font-semibold text-ink">
                    {r.name}
                  </p>
                  <p className="text-sm text-gold-dark">
                    {r.priceNight} / night
                  </p>
                </div>
              </button>
            ))}
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

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" variant="primary" className="flex-1">
            <CalendarCheck className="h-4 w-4" /> Book Now
          </Button>
          <Button asChild variant="gold" className="flex-1">
            <a
              href={`https://wa.me/${siteConfig.phones.e164Primary.replace(
                "+",
                ""
              )}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> Book on WhatsApp
            </a>
          </Button>
        </div>
        <p className="text-center text-xs text-ink/50">
          We&apos;ll confirm availability and share final details over a call or
          WhatsApp. No advance payment required to request a booking.
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink/55">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
