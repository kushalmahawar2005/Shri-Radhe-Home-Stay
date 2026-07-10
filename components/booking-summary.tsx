"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { BLUR_DATA_URL } from "@/lib/utils";

export function BookingSummary() {
  const search = useSearchParams();

  const roomName = search.get("room") ?? "Room on request";
  const matched = siteConfig.rooms.find((r) => r.name === roomName);

  const rows = [
    { label: "Booking ID", value: search.get("id") ?? "—" },
    { label: "Guest Name", value: search.get("name") || "—" },
    { label: "Phone Number", value: search.get("phone") || "—" },
    { label: "Room", value: roomName },
    { label: "Check In", value: search.get("checkin") || "—" },
    { label: "Check Out", value: search.get("checkout") || "—" },
    { label: "Guests", value: search.get("guests") || "—" },
  ];

  const total = search.get("total");
  if (total) {
    rows.push({ label: "Total Price", value: `₹${parseInt(total, 10).toLocaleString('en-IN')}` });
  }

  const paymentStatus = search.get("paymentStatus");
  if (paymentStatus === "paid") {
    rows.push({
      label: "Payment Status",
      value: `₹${siteConfig.advanceAmount} Advance Paid`,
    });
  }

  return (
    <div className="grid gap-6 rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-card md:grid-cols-[1.4fr_1fr] md:items-center">
      <dl className="space-y-3 text-sm">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between gap-3 border-b border-gold/15 pb-3 last:border-0 last:pb-0"
          >
            <dt className="text-ink/55">{r.label}</dt>
            <dd className="text-right font-medium text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>

      <figure className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gold/30">
        <Image
          src={matched?.image ?? "/images/room-deluxe.jpg"}
          alt={matched?.alt ?? "Room at Shri Radha Home Stay"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
      </figure>
    </div>
  );
}
