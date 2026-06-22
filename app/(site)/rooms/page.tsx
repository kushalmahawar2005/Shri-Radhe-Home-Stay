import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle, Users, ArrowRight, CalendarCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getRooms } from "@/lib/content-store";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Facilities } from "@/components/facilities";
import { Reveal } from "@/components/reveal";
import { BLUR_DATA_URL } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Rooms",
  description:
    "Explore the AC rooms at Shri Radha Home Stay, Nathdwara — Deluxe, Family and Premium rooms with attached bathrooms, 24x7 hot water and free WiFi. Prices on request.",
  alternates: { canonical: "/rooms" },
};

export default async function RoomsPage() {
  const rooms = await getRooms();
  return (
    <>
      {/* page header */}
      <section className="bg-cream-gradient py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Accommodation"
            title="Our Comfortable Rooms"
            highlight="Comfortable"
            subtitle="Every room is air-conditioned with an attached bathroom, 24x7 hot water, free WiFi and fresh, clean linen. Prices are kept on request — message us for the best rate for your dates."
          />
        </div>
      </section>

      {/* room rows */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container flex flex-col gap-12">
          {rooms.map((room, i) => (
            <Reveal
              key={room.slug}
              className={`grid items-center gap-8 md:grid-cols-2 ${
                i % 2 === 1 ? "md:[&>figure]:order-2" : ""
              }`}
            >
              <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/30 shadow-card">
                <Image
                  src={room.image}
                  alt={room.alt}
                  fill
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </figure>

              <div>
                <h2 className="font-serif text-3xl font-bold text-ink">
                  {room.name}
                </h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-gold-dark">
                  <Users className="h-4 w-4" /> {room.guests}
                </p>
                <p className="mt-4 text-ink/80">{room.blurb}</p>

                <ul className="mt-5 grid grid-cols-2 gap-2">
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

                <p className="mt-6 text-sm text-ink/70">
                  <span className="font-serif text-2xl font-bold text-emerald">
                    {room.priceNight}
                  </span>{" "}
                  / night
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button asChild variant="primary" size="sm">
                    <Link href={`/rooms/${room.slug}`}>
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="gold" size="sm">
                    <Link href={`/booking?room=${room.slug}`}>
                      <CalendarCheck className="h-4 w-4" /> Check Availability
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={siteConfig.links.whatsappPrimary}
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
      <section className="bg-cream-alt py-14 md:py-20">
        <div className="container">
          <Facilities />
        </div>
      </section>
    </>
  );
}
