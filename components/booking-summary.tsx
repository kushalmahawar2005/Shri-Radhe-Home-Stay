"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CalendarDays, Users } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { BLUR_DATA_URL, cn } from "@/lib/utils";

function formatDate(d: string | null) {
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return d || "—";
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function nightsBetween(a: string | null, b: string | null) {
  if (!a || !b) return 0;
  const ms = new Date(`${b}T00:00:00`).getTime() - new Date(`${a}T00:00:00`).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function BookingSummary() {
  const search = useSearchParams();

  const roomName = search.get("room") ?? "Room on request";
  const matched = siteConfig.rooms.find((r) => r.name === roomName);
  const checkIn = search.get("checkin");
  const checkOut = search.get("checkout");
  const nights = nightsBetween(checkIn, checkOut);
  const total = Number(search.get("total")) || 0;
  const paid = search.get("paymentStatus") === "paid";
  const advance = paid ? siteConfig.advanceAmount : 0;
  const balance = Math.max(0, total - advance);

  const guestRows = [
    { label: "Guest name", value: search.get("name") || "—" },
    { label: "Phone", value: search.get("phone") || "—" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gold/30 bg-cream-light shadow-card">
      {/* Room header */}
      <div className="flex items-center gap-4 border-b border-gold/20 p-4 sm:p-5">
        <figure className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-gold/30 sm:h-24 sm:w-32">
          <Image
            src={matched?.image ?? "/images/building.jpg"}
            alt={matched?.alt ?? "Room at Shri Radha Villa Stay"}
            fill
            sizes="128px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </figure>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-gold-dark">
            Booking ID · {search.get("id") ?? "—"}
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-ink">{roomName}</p>
          {matched?.priceNight ? (
            <p className="text-sm text-ink/60">{matched.priceNight} / night</p>
          ) : null}
        </div>
      </div>

      {/* Stay */}
      <div className="grid gap-px bg-gold/15 sm:grid-cols-3">
        <div className="bg-cream-light p-4 sm:p-5">
          <p className="flex items-center gap-1.5 text-xs text-ink/55"><CalendarDays className="h-3.5 w-3.5" /> Check-in</p>
          <p className="mt-1 font-semibold text-ink">{formatDate(checkIn)}</p>
        </div>
        <div className="bg-cream-light p-4 sm:p-5">
          <p className="flex items-center gap-1.5 text-xs text-ink/55"><CalendarDays className="h-3.5 w-3.5" /> Check-out</p>
          <p className="mt-1 font-semibold text-ink">{formatDate(checkOut)}</p>
        </div>
        <div className="bg-cream-light p-4 sm:p-5">
          <p className="flex items-center gap-1.5 text-xs text-ink/55"><Users className="h-3.5 w-3.5" /> Guests</p>
          <p className="mt-1 font-semibold text-ink">
            {search.get("guests") || "—"}
            {nights ? <span className="font-normal text-ink/60"> · {nights} night{nights === 1 ? "" : "s"}</span> : null}
          </p>
        </div>
      </div>

      {/* Guest + payment */}
      <div className="grid gap-6 border-t border-gold/20 p-4 sm:grid-cols-2 sm:p-5">
        <dl className="space-y-2 text-sm">
          {guestRows.map((r) => (
            <div key={r.label} className="flex justify-between gap-3">
              <dt className="text-ink/55">{r.label}</dt>
              <dd className="text-right font-medium text-ink">{r.value}</dd>
            </div>
          ))}
        </dl>

        {total ? (
          <dl className="space-y-2 rounded-xl bg-cream p-4 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink/55">Total for stay</dt>
              <dd className="font-medium text-ink">{rupees(total)}</dd>
            </div>
            {paid ? (
              <div className="flex justify-between gap-3">
                <dt className="text-ink/55">Advance paid</dt>
                <dd className="font-medium text-emerald">− {rupees(advance)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3 border-t border-gold/25 pt-2">
              <dt className="font-semibold text-ink">{paid ? "Pay at check-in" : "Pay at the villa"}</dt>
              <dd className={cn("text-lg font-bold text-emerald")}>{rupees(balance)}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </div>
  );
}
