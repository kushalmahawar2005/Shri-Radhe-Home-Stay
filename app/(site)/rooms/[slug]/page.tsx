import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  Star,
  Footprints,
  Snowflake,
  Users,
  BedDouble,
  Maximize,
  Phone,
  ChevronRight,
  ShieldCheck,
  Info,
  ArrowRight,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import {
  absoluteUrl,
  breadcrumbSchema,
  priceNumber,
  SITE_URL,
} from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import {
  getRooms,
  getRoomBySlug,
  getBlockedRanges,
  getBrand,
  getContact,
} from "@/lib/content-store";
import { Button } from "@/components/ui/button";
import { AvailabilityCard } from "@/components/availability-card";
import { RoomGallery } from "@/components/room-gallery";
import { Reveal } from "@/components/reveal";
import { Flourish } from "@/components/decor";
import { BLUR_DATA_URL } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const rooms = await getRooms();
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const room = await getRoomBySlug(params.slug);
  if (!room) return { title: "Room Not Found", robots: { index: false } };
  const title = `${room.name} in Nathdwara — ${room.priceNight}/Night`;
  const isNonAc = room.features.some((f) => /non[\s-]?ac/i.test(f));
  const facts = [isNonAc ? "Non-AC" : "AC", room.guests, room.bed, room.size].filter(Boolean).join(", ");
  const description = `${room.name} at ${siteConfig.name}, Nathdwara — ${room.blurb} ${facts}. From ${room.priceNight} per night incl. tea & coffee, an ${siteConfig.templeWalkTime} from Shrinathji Temple.`;
  return {
    title,
    description,
    keywords: [
      `${room.name} Nathdwara`,
      "rooms near Shrinathji Temple",
      isNonAc ? "budget room Nathdwara" : "AC room Nathdwara booking",
      `${room.guests} room Nathdwara`,
    ],
    alternates: { canonical: `/rooms/${room.slug}/` },
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(`/rooms/${room.slug}`),
      images: [{ url: room.image, alt: room.alt }],
    },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [allRooms, blockedRanges, brand, contact] = await Promise.all([
    getRooms(),
    getBlockedRanges(),
    getBrand(),
    getContact(),
  ]);
  const room = allRooms.find((r) => r.slug === params.slug);
  if (!room) notFound();

  const others = allRooms.filter((r) => r.slug !== room.slug);

  const isNonAc = room.features.some((f) => /non[\s-]?ac/i.test(f));
  const quickFacts = [
    { icon: Snowflake, label: isNonAc ? "Non-AC Room" : "AC Room" },
    { icon: Users, label: room.guests },
    { icon: BedDouble, label: room.bed },
    { icon: Maximize, label: room.size },
  ].filter((fact) => fact.label.trim() !== "");

  // HotelRoom + Offer makes the nightly rate eligible for rich results, and
  // ties this page back to the site-wide Hotel entity in the root layout.
  const roomSchema = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: `${room.name} — ${brand.name}, Nathdwara`,
    description: room.blurb,
    url: absoluteUrl(`/rooms/${room.slug}`),
    image: Array.from(new Set([room.image, ...room.gallery])).map((src) =>
      src.startsWith("http") ? src : `${SITE_URL}${src}`
    ),
    ...(room.bed ? { bed: { "@type": "BedDetails", typeOfBed: room.bed } } : {}),
    occupancy: { "@type": "QuantitativeValue", name: room.guests },
    ...(room.size ? { floorSize: { "@type": "QuantitativeValue", name: room.size } } : {}),
    amenityFeature: room.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    containedInPlace: { "@id": `${SITE_URL}/#lodging` },
    offers: {
      "@type": "Offer",
      price: priceNumber(room.priceNight),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/booking"),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: priceNumber(room.priceNight),
        priceCurrency: "INR",
        unitCode: "DAY",
        unitText: "per night",
      },
    },
  };

  return (
    <>
      <Schema data={roomSchema} />
      <Schema
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Rooms", path: "/rooms" },
          { name: room.name, path: `/rooms/${room.slug}` },
        ])}
      />

      {/* breadcrumb + header */}
      <section className="bg-cream-gradient pb-4 pt-4 md:pb-12 md:pt-8">
        <div className="container">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 text-xs text-ink/55 sm:text-sm"
          >
            <Link href="/" className="hover:text-emerald">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/rooms" className="hover:text-emerald">
              Rooms
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-emerald">{room.name}</span>
          </nav>

          <div className="mt-3 flex flex-col gap-2 md:mt-5 md:gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold leading-tight text-ink sm:text-5xl">
                {room.name}
              </h1>
              <p className="mt-1 font-serif text-base italic leading-snug text-gold-dark sm:text-xl">
                {room.tagline}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:gap-5 sm:text-sm">
              <span className="flex items-center gap-1.5 font-medium text-ink/75">
                <Star className="h-4 w-4 fill-gold text-gold" /> Loved by Guests
              </span>
              <span className="flex items-center gap-1.5 font-medium text-ink/75">
                <Footprints className="h-4 w-4 text-emerald" />
                {siteConfig.templeWalkTime} to Shrinathji Temple
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* main two-column layout */}
      <section className="bg-cream pb-8 pt-2 md:py-14">
        <div className="container grid min-w-0 gap-5 md:gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
          {/* Photos and essential facts come before booking on mobile. */}
          <div className="min-w-0 space-y-3 lg:col-start-1 lg:row-start-1 md:space-y-6">
            {/* gallery */}
            <Reveal>
              <RoomGallery
                images={Array.from(new Set([room.image, ...room.gallery]))}
                name={room.name}
              />
            </Reveal>

            {/* quick facts */}
            <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-4 sm:gap-3">
              {quickFacts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-cream-light px-2.5 py-2 text-xs font-medium text-ink/75 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                >
                  <f.icon className="h-4 w-4 shrink-0 text-emerald sm:h-5 sm:w-5" />
                  {f.label}
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT — sticky sidebar */}
          <aside id="room-booking" className="flex min-w-0 scroll-mt-24 flex-col gap-4 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:gap-6">
            <div>
              <div className="mb-3 flex items-baseline gap-1 rounded-xl border border-gold/30 bg-emerald px-4 py-2.5 sm:mb-4 sm:rounded-2xl sm:px-6 sm:py-4 text-cream-light shadow-card">
                <span className="font-serif text-3xl font-bold">
                  {room.priceNight}
                </span>
                <span className="text-sm text-cream/80">/ night</span>
              </div>
              <AvailabilityCard
                roomSlug={room.slug}
                rooms={allRooms}
                blockedRanges={blockedRanges}
                brandName={brand.name}
                whatsappNumber={contact.phones.e164Primary.replace("+", "")}
              />
            </div>

            <div className="hidden lg:contents">
            <div className="rounded-2xl border border-gold/30 bg-cream-light p-5 shadow-soft">
              <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-emerald">
                <Phone className="h-5 w-5" /> Need Help?
              </h3>
              <p className="mt-1 text-sm text-ink/65">
                Call us for quick booking assistance.
              </p>
              <a
                href={contact.phones.telPrimary}
                className="mt-2 block font-serif text-2xl font-bold text-ink hover:text-emerald"
              >
                {contact.phones.primary}
              </a>
            </div>

            <div className="rounded-2xl border border-gold/30 bg-cream-light p-5 shadow-soft">
              <h3 className="font-serif text-lg font-semibold text-emerald">
                Why Book With Us?
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald" /> Best Price Guarantee
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald" /> Clean & Hygienic Rooms
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald" /> 24x7 Support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald" /> Trusted by Happy Devotees
                </li>
              </ul>
            </div>

            <figure className="rounded-2xl border border-gold/30 bg-cream-light p-5 text-center shadow-soft">
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="mt-2 text-sm italic text-ink/70">
                &ldquo;Very clean rooms and peaceful environment. Staff is very
                polite and helpful.&rdquo;
              </blockquote>
              <figcaption className="mt-2 text-xs font-medium text-emerald">
                — Rajesh Sharma
              </figcaption>
            </figure>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-5 lg:col-start-1 lg:row-start-2 md:gap-8">
            {/* about */}
            <Reveal>
              <h2 className="font-serif text-2xl font-bold text-ink">
                About This Room
              </h2>
              <Flourish className="ml-0 mt-2 hidden sm:block" />
              <p className="mt-2 text-sm leading-6 text-ink/80 sm:mt-4 sm:text-base">{room.blurb}</p>
              <p className="mt-2 text-sm leading-6 text-ink/80 sm:mt-3 sm:text-base">
                Tea, coffee and milk are on us, along with free WiFi, mineral
                water and round-the-clock hot water. Wake up to a peaceful
                morning and walk to Shrinathji darshan in minutes.
              </p>
            </Reveal>

            {/* amenities + highlights */}
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-8">
              <Reveal>
                <h3 className="font-serif text-xl font-semibold text-emerald">
                  Room Amenities
                </h3>
                <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-1 sm:mt-4">
                  {room.amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-start gap-1.5 text-xs leading-5 text-ink/75 sm:items-center sm:gap-2 sm:text-sm"
                    >
                      <Check className="h-4 w-4 shrink-0 text-emerald" />
                      {a}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1}>
                <h3 className="font-serif text-xl font-semibold text-emerald">
                  Room Highlights
                </h3>
                <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-1 sm:mt-4">
                  {room.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-1.5 text-xs leading-5 text-ink/75 sm:items-center sm:gap-2 sm:text-sm"
                    >
                      <Star className="h-4 w-4 shrink-0 fill-gold text-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* policy boxes */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-gold/30 bg-cream-light p-5 shadow-soft">
                <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
                  <ShieldCheck className="h-5 w-5 text-emerald" /> Cancellation
                  Policy
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
                  <li>· Free cancellation before 24 hours of check-in.</li>
                  <li>· No refund for cancellations made within 24 hours.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-gold/30 bg-cream-light p-5 shadow-soft">
                <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
                  <Info className="h-5 w-5 text-emerald" /> Important
                  Information
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
                  <li>· Early check-in or late check-out subject to availability.</li>
                  <li>· For any special request, please contact us in advance.</li>
                </ul>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* you may also like */}
      <section className="bg-cream-alt py-5 sm:py-14 md:py-20">
        <div className="container">
          <h2 className="text-center font-serif text-3xl font-bold text-ink">
            You May Also <span className="text-emerald">Like</span>
          </h2>
          <Flourish className="mx-auto mt-3" />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((r) => (
              <article
                key={r.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gold/30 bg-cream-light shadow-soft"
              >
                <figure className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </figure>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-xl font-bold text-ink">
                    {r.name}
                  </h3>
                  <p className="mt-1 text-sm text-gold-dark">
                    <span className="font-serif text-lg font-semibold text-emerald">
                      {r.priceNight}
                    </span>{" "}
                    / night
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    <Link href={`/rooms/${r.slug}`}>
                      View Room <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
