import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { SectionHeading } from "@/components/section-heading";
import { Icon } from "@/components/icon";
import { BookingForm } from "@/components/booking-form";
import { bookingPerks } from "@/lib/site-config";
import { breadcrumbSchema } from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import {
  getRooms,
  getBlockedRanges,
  getBrand,
  getContact,
} from "@/lib/content-store";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Book Online — Room Booking in Nathdwara",
  description:
    "Book a room online at Shri Radha Villa Stay, Nathdwara. Pick your dates, room and guests, pay a small advance and get instant confirmation — or book over WhatsApp for the best direct price.",
  keywords: [
    "Nathdwara hotel booking online",
    "book room near Shrinathji Temple",
    "Nathdwara room booking",
    "online booking home stay Nathdwara",
  ],
  alternates: { canonical: "/booking/" },
};

export default async function BookingPage() {
  const [rooms, blockedRanges, brand, contact] = await Promise.all([
    getRooms(),
    getBlockedRanges(),
    getBrand(),
    getContact(),
  ]);
  return (
    <>
      <Schema
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Book Your Stay", path: "/booking" },
        ])}
      />

      <section className="relative overflow-hidden bg-cream-gradient py-5 sm:py-14 md:py-20">
        <Image
          src="/rangoli.png"
          alt=""
          aria-hidden="true"
          width={220}
          height={220}
          className="pointer-events-none absolute right-8 top-1/2 hidden h-auto w-48 -translate-y-1/2 opacity-90 lg:block xl:w-60"
        />
        <div className="container relative">
          <SectionHeading
            as="h1"
            eyebrow="Reserve Your Room"
            title="Book Your Stay in Nathdwara"
            highlight="Book"
            subtitle="Experience comfort, devotion and warm hospitality at Shri Radha Villa Stay, Nathdwara."
          />
        </div>
      </section>

      <section className="bg-cream py-5 sm:py-12 md:py-16">
        <div className="container">
          <Suspense fallback={<div className="h-40" />}>
            <BookingForm
              rooms={rooms}
              blockedRanges={blockedRanges}
              brandName={brand.name}
              whatsappNumber={contact.phones.e164Primary.replace("+", "")}
            />
          </Suspense>
        </div>
      </section>

      {/* trust badges */}
      <section className="bg-cream-alt py-5 sm:py-12 md:py-14">
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
