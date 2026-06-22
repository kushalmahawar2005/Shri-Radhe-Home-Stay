import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/section-heading";
import { Icon } from "@/components/icon";
import { BookingForm } from "@/components/booking-form";
import { bookingPerks } from "@/lib/site-config";
import { getRooms } from "@/lib/content-store";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Book Your Stay",
  description:
    "Book your stay at Shri Radha Home Stay, Nathdwara. Choose your room, dates and guests — we confirm availability and the best price directly over call or WhatsApp.",
  alternates: { canonical: "/booking" },
};

export default async function BookingPage() {
  const rooms = await getRooms();
  return (
    <>
      <section className="bg-cream-gradient py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Reserve Your Room"
            title="Book Your Stay"
            highlight="Book"
            subtitle="Experience comfort, devotion and warm hospitality at Shri Radha Home Stay, Nathdwara."
          />
        </div>
      </section>

      <section className="bg-cream py-12 md:py-16">
        <div className="container">
          <Suspense fallback={<div className="h-40" />}>
            <BookingForm rooms={rooms} />
          </Suspense>
        </div>
      </section>

      {/* trust badges */}
      <section className="bg-cream-alt py-12 md:py-14">
        <div className="container grid grid-cols-2 gap-4 lg:grid-cols-4">
          {bookingPerks.map((p) => (
            <div
              key={p.title}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-cream-light px-5 py-6 text-center shadow-soft"
            >
              <Icon name={p.icon} className="h-7 w-7 text-gold-dark" />
              <h3 className="font-serif text-base font-semibold text-emerald">
                {p.title}
              </h3>
              <p className="text-xs text-ink/60">{p.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
