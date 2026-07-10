"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { siteConfig, type Room } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import {
  DateRangePicker,
  type BlockedRange,
} from "@/components/ui/date-range-picker";

/**
 * Compact "Check Availability" widget for the room detail sidebar.
 * Builds a pre-filled WhatsApp message and forwards the guest to /booking
 * with the chosen room + dates pre-selected.
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
  const room = rooms.find((r) => r.slug === roomSlug);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");
  const [selected, setSelected] = useState(roomSlug);

  const blockedForRoom = blockedRanges[selected] ?? [];

  const inputCls =
    "w-full rounded-lg border border-gold/40 bg-cream-light px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

  function goToBooking() {
    const params = new URLSearchParams({
      room: selected,
      checkin: checkIn,
      checkout: checkOut,
      guests,
    });
    router.push(`/booking?${params.toString()}`);
  }

  const waMessage = `Jai Shri Krishna! I'd like to check availability for the ${
    room?.name ?? "room"
  } at ${brandName}.${checkIn ? `\nCheck-in: ${checkIn}` : ""}${
    checkOut ? `\nCheck-out: ${checkOut}` : ""
  }\nGuests: ${guests}`;

  return (
    <div className="rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-semibold text-emerald">
          Check Availability
        </h3>
        <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold-dark">
          Best Price
        </span>
      </div>

      <div className="mt-5">
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

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-ink/70">
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
            <option>4 Adults</option>
            <option>5 Adults</option>
            <option>6 Guests</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-ink/70">
          Room
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className={inputCls}
          >
            {rooms.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Button
        type="button"
        variant="gold"
        className="mt-5 w-full"
        onClick={goToBooking}
      >
        <CalendarCheck className="h-4 w-4" /> Check Availability
      </Button>

      <div className="mt-4 rounded-xl border border-gold/30 bg-cream p-4">
        <p className="text-sm font-semibold text-emerald">
          Quick Booking on WhatsApp
        </p>
        <p className="mt-0.5 text-xs text-ink/60">
          Get instant confirmation
        </p>
        <Button
          asChild
          variant="primary"
          size="sm"
          className="mt-3 w-full"
        >
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
    </div>
  );
}
