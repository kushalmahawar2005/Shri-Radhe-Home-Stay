import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle, Users, ArrowRight, CalendarCheck } from "lucide-react";
import { getRooms, getContact } from "@/lib/content-store";
import { breadcrumbSchema } from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { Facilities } from "@/components/facilities";
import { Reveal } from "@/components/reveal";
import { BLUR_DATA_URL } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AC & Non-AC Rooms in Nathdwara Near Shrinathji Temple",
  description:
    "7 AC and non-AC rooms at Shri Radha Villa Stay, Nathdwara — attached bathrooms with geyser, free tea & coffee, 24x7 hot water, free WiFi and free parking, an 8 minute walk from Shrinathji Temple. See per-night rates and book direct.",
  keywords: [
    "AC rooms in Nathdwara",
    "rooms near Shrinathji Temple",
    "family room Nathdwara",
    "non AC rooms Nathdwara",
    "Nathdwara room booking",
    "budget rooms Nathdwara",
  ],
  alternates: { canonical: "/rooms/" },
};

export default async function RoomsPage() {
  const [rooms, contact] = await Promise.all([getRooms(), getContact()]);
  return (
    <>
      <Schema
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Rooms", path: "/rooms" },
        ])}
      />

      {/* page header */}
      <section className="bg-cream-gradient pb-3 pt-5 sm:pb-6 sm:pt-10 md:pt-12">
        <div className="container">
          <h1 className="font-serif text-3xl font-bold leading-tight text-emerald sm:text-4xl">AC &amp; Non-AC Rooms</h1>
          <p className="mt-1 text-sm leading-5 text-ink/65 sm:mt-2 sm:text-base">7 rooms, an 8-minute walk from Shrinathji Temple.</p>
          <p className="mt-2 text-xs leading-5 text-ink/60 sm:text-sm">Attached bath · Hot water · Free WiFi · Tea &amp; coffee</p>
        </div>
      </section>

      {/* room rows */}
      <section className="bg-cream pb-8 pt-2 md:py-10">
        <div className="container grid grid-cols-2 gap-3 sm:gap-5 md:flex md:flex-col md:gap-10">
          {rooms.map((room, i) => (
            <Reveal
              key={room.slug}
              className={`flex h-full min-w-0 flex-col overflow-hidden rounded-[1rem] border border-gold/30 bg-cream-light shadow-soft md:grid md:items-center md:gap-8 md:rounded-none md:border-0 md:bg-transparent md:shadow-none md:grid-cols-2 ${
                i % 2 === 1 ? "md:[&>figure]:order-2" : ""
              }`}
            >
              <figure className="group relative aspect-[4/3] shrink-0 overflow-hidden md:rounded-2xl md:border md:border-gold/30 md:shadow-card">
                <Image
                  src={room.image}
                  alt={room.alt}
                  fill
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover object-[center_65%] transition-transform duration-700 group-hover:scale-105"
                />
              </figure>

              <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4 md:p-0">
                <h2 className="font-serif text-xl font-bold leading-5 text-ink md:text-3xl md:leading-tight">
                  {room.name}
                </h2>
                <p className="mt-2 text-xs leading-4 text-gold-dark md:mt-1 md:flex md:items-center md:gap-2 md:text-sm">
                  <Users className="hidden h-4 w-4 shrink-0 md:block" />
                  <span className="md:hidden">{room.features[0]} · </span>{room.guests}
                </p>
                <p className="mt-4 hidden text-ink/80 md:block">{room.blurb}</p>

                <ul className="mt-5 hidden grid-cols-2 gap-2 md:grid">
                  {room.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-ink/75"
                    >
                      <Check className="h-4 w-4 shrink-0 text-emerald" />
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="mt-2 text-[11px] text-ink/70 md:mt-6 md:text-sm">
                  <span className="font-serif text-xl font-bold text-emerald md:text-2xl">
                    {room.priceNight}
                  </span>{" "}
                  / night
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-3 md:mt-4 md:pt-0">
                  <Button asChild variant="primary" size="sm" className="h-10 min-w-0 w-full gap-1 px-2 text-[11px] tracking-normal md:h-9 md:w-auto md:gap-2 md:px-4 md:text-sm md:tracking-wide">
                    <Link href={`/rooms/${room.slug}`} aria-label={`View ${room.name} details`}>
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="gold" size="sm" className="hidden md:inline-flex">
                    <Link href={`/booking?room=${room.slug}`}>
                      <CalendarCheck className="h-4 w-4" /> Check Availability
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                    <a
                      href={contact.links.whatsappPrimary}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* facilities recap */}
      <section className="bg-cream-alt py-6 md:py-14">
        <div className="container">
          <Facilities />
        </div>
      </section>
    </>
  );
}
