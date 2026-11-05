"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarCheck, CheckCircle2, ChevronDown, Loader2, MessageCircle, Users, XCircle } from "lucide-react";
import { siteConfig, guestOptions, type Room } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import {
  DateRangePicker,
  type BlockedRange,
} from "@/components/ui/date-range-picker";
import { checkRoomAvailability, type AvailabilityResult } from "@/app/(site)/booking/actions";

function overlaps(from: string, to: string, blocked: BlockedRange[]) {
  return Boolean(from && to) && blocked.some((b) => b.from < to && b.to > from);
}

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

function fmt(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/**
 * "Check Availability" widget for the room detail sidebar. Checks the dates
 * live against the database and shows the answer right here; only when the
 * room is free does it offer to continue to /booking, landing the guest
 * directly on the details form.
 */
export function AvailabilityCard({
  roomSlug,
  rooms = siteConfig.rooms,
  blockedRanges = {},
  brandName = siteConfig.name,
  whatsappNumber = siteConfig.phones.e164Primary.replace("+", ""),
}: {
  roomSlug: string;
  rooms?: Room[];
  blockedRanges?: Record<string, BlockedRange[]>;
  brandName?: string;
  /** Bare e164 digits (no +) for the WhatsApp deep link. */
  whatsappNumber?: string;
}) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<string>("2 Adults");
  const [selected, setSelected] = useState(roomSlug);
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [error, setError] = useState("");
  const [checking, startCheck] = useTransition();

  const room = rooms.find((r) => r.slug === selected) ?? rooms[0];
  const blockedForRoom = blockedRanges[selected] ?? [];
  const nights = nightsBetween(checkIn, checkOut);
  const rate = Number(room?.priceNight.replace(/[^0-9]/g, "")) || 0;
  const total = nights * rate;

  const inputCls =
    "h-11 w-full min-w-0 appearance-none rounded-[0.75rem] border border-gold/40 bg-[#fffdf7] pl-3 pr-10 text-base font-medium text-ink transition-colors hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:text-sm";

  function reset() {
    setResult(null);
    setError("");
  }

  function check() {
    if (!checkIn || !checkOut) {
      setError("Please choose your check-in and check-out dates first.");
      return;
    }
    setError("");
    // The calendar already knows some booked dates — answer instantly for those.
    if (overlaps(checkIn, checkOut, blockedForRoom)) {
      setResult({ status: "booked", alternatives: [] });
    }
    startCheck(async () => {
      setResult(await checkRoomAvailability({ roomSlug: selected, checkIn, checkOut }));
    });
  }

  function continueBooking(slug = selected) {
    const params = new URLSearchParams({ room: slug, checkin: checkIn, checkout: checkOut, guests });
    router.push(`/booking?${params.toString()}#your-details`);
  }

  const waMessage = `Jai Shri Krishna! I'd like to check availability for the ${
    room?.name ?? "room"
  } at ${brandName}.${checkIn ? `\nCheck-in: ${checkIn}` : ""}${
    checkOut ? `\nCheck-out: ${checkOut}` : ""
  }\nGuests: ${guests}`;

  return (
    <div className="rounded-xl border border-gold/30 bg-cream-light p-4 shadow-card sm:rounded-2xl sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-semibold text-emerald">
          Check Availability
        </h3>
        <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold-dark">
          Best Price
        </span>
      </div>

      <div className="mt-3 sm:mt-5">
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          blocked={blockedForRoom}
          onChange={(ci, co) => {
            setCheckIn(ci);
            setCheckOut(co);
            reset();
          }}
        />
      </div>

      <div className="mt-3 grid min-w-0 gap-3">
        <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-ink/70">
          Guests
          <span className="relative block min-w-0">
            <select value={guests} onChange={(e) => setGuests(e.target.value)} className={inputCls}>
              {guestOptions.map((g) => <option key={g}>{g}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald" aria-hidden="true" />
          </span>
        </label>
        <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-ink/70">
          Room
          <span className="relative block min-w-0">
            <select
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                reset();
              }}
              className={inputCls}
            >
              {rooms.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald" aria-hidden="true" />
          </span>
        </label>
      </div>
      {room?.guests ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald/80">
          <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Room capacity: {room.guests}
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
      ) : null}

      {/* Result */}
      <div aria-live="polite">
        {checking && !result ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-ink/60"><Loader2 className="h-4 w-4 animate-spin" /> Checking live availability…</p>
        ) : null}

        {result?.status === "available" ? (
          <div className="mt-4 rounded-xl border border-emerald/40 bg-emerald/5 p-4">
            <p className="flex items-center gap-2 font-semibold text-emerald"><CheckCircle2 className="h-5 w-5" /> Available!</p>
            <p className="mt-1 text-sm text-ink/75">
              {room?.name} is free from {fmt(checkIn)} to {fmt(checkOut)} · {nights} night{nights === 1 ? "" : "s"}
              {total ? <> · <strong className="text-ink">₹{total.toLocaleString("en-IN")}</strong> total</> : null}
            </p>
            <Button type="button" variant="primary" className="mt-3 w-full" onClick={() => continueBooking()}>
              Continue Booking <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}

        {result?.status === "booked" ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="flex items-center gap-2 font-semibold text-red-700"><XCircle className="h-5 w-5" /> Not available</p>
            <p className="mt-1 text-sm text-ink/75">{room?.name} is already booked for some of these dates. Try other dates{result.alternatives.length ? " or one of these rooms" : ""}:</p>
            {checking ? (
              <p className="mt-2 flex items-center gap-2 text-xs text-ink/55"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Looking for other free rooms…</p>
            ) : null}
            {result.alternatives.length ? (
              <ul className="mt-3 flex flex-col gap-2">
                {result.alternatives.map((alt) => (
                  <li key={alt.slug}>
                    <button
                      type="button"
                      onClick={() => continueBooking(alt.slug)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg border border-emerald/30 bg-white px-3 py-2 text-left text-sm transition hover:border-emerald"
                    >
                      <span className="font-medium text-ink">{alt.name} <span className="text-ink/55">· {alt.priceNight}/night</span></span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald">Book <ArrowRight className="h-3.5 w-3.5" /></span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {result?.status === "unknown" ? (
          <div className="mt-4 rounded-xl border border-gold/40 bg-cream p-4">
            <p className="text-sm text-ink/75">We couldn&apos;t confirm these dates automatically. You can still send a booking request and we&apos;ll confirm on call or WhatsApp.</p>
            <Button type="button" variant="primary" className="mt-3 w-full" onClick={() => continueBooking()}>
              Continue Booking <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>

      {result?.status !== "available" ? (
        <Button type="button" variant="gold" className="mt-5 w-full" onClick={check} disabled={checking}>
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}
          {checking ? "Checking…" : "Check Availability"}
        </Button>
      ) : null}

      <div className="mt-4 rounded-xl border border-gold/30 bg-cream p-4">
        <p className="text-sm font-semibold text-emerald">
          Quick Booking on WhatsApp
        </p>
        <p className="mt-0.5 text-xs text-ink/60">
          Get instant confirmation
        </p>
        <Button asChild variant="primary" size="sm" className="mt-3 w-full">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" /> Book on WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
