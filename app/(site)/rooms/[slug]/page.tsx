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
import { Button } from "@/components/ui/button";
import { AvailabilityCard } from "@/components/availability-card";
import { Reveal } from "@/components/reveal";
import { Flourish } from "@/components/decor";
import { BLUR_DATA_URL } from "@/lib/utils";

export const dynamic = "force-static";

export function generateStaticParams() {
  return siteConfig.rooms.map((room) => ({ slug: room.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const room = siteConfig.rooms.find((r) => r.slug === params.slug);
  if (!room) return { title: "Room Not Found" };
  return {
    title: room.name,
    description: `${room.name} at ${siteConfig.name}, Nathdwara — ${room.blurb} From ${room.priceNight}/night.`,
    alternates: { canonical: `/rooms/${room.slug}` },
  };
}

export default function RoomDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const room = siteConfig.rooms.find((r) => r.slug === params.slug);
  if (!room) notFound();

  const others = siteConfig.rooms.filter((r) => r.slug !== room.slug);

  const quickFacts = [
    { icon: Snowflake, label: "AC Room" },
    { icon: Users, label: room.guests },
    { icon: BedDouble, label: room.bed },
    { icon: Maximize, label: room.size },
  ];

  return (
    <>
      {/* breadcrumb + header */}
      <section className="bg-cream-gradient pb-10 pt-8 md:pb-12">
        <div className="container">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 text-sm text-ink/55"
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

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
                {room.name}
              </h1>
              <p className="mt-1 font-serif text-xl italic text-gold-dark">
                {room.tagline}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-ink/75">
                <Star className="h-4 w-4 fill-gold text-gold" /> 4.9 / 5
                <span className="text-ink/50">(120+ Reviews)</span>
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
      <section className="bg-cream py-10 md:py-14">
        <div className="container grid gap-10 lg:grid-cols-[1.7fr_1fr] lg:items-start">
          {/* LEFT */}
          <div className="flex flex-col gap-10">
            {/* gallery */}
            <Reveal>
              <figure className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gold/30 shadow-card">
                <Image
                  src={room.image}
                  alt={room.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </figure>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {room.gallery.map((src, i) => (
                  <figure
                    key={src + i}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gold/30"
                  >
                    <Image
                      src={src}
                      alt={`${room.name} view ${i + 1}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 25vw, 15vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      className="object-cover"
                    />
                  </figure>
                ))}
              </div>
            </Reveal>

            {/* quick facts */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickFacts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 rounded-xl border border-gold/30 bg-cream-light px-4 py-3 text-sm font-medium text-ink/75 shadow-soft"
                >
                  <f.icon className="h-5 w-5 text-emerald" />
                  {f.label}
                </div>
              ))}
            </div>

            {/* about */}
            <Reveal>
              <h2 className="font-serif text-2xl font-bold text-ink">
                About This Room
              </h2>
              <Flourish className="ml-0 mt-2" />
              <p className="mt-4 leading-relaxed text-ink/80">{room.blurb}</p>
              <p className="mt-3 leading-relaxed text-ink/80">
                Designed for a relaxing stay, this room comes with all modern
                amenities and a beautiful view of the temple town. Wake up to a
                peaceful morning and step out for darshan in minutes.
              </p>
            </Reveal>

            {/* amenities + highlights */}
            <div className="grid gap-8 sm:grid-cols-2">
              <Reveal>
                <h3 className="font-serif text-xl font-semibold text-emerald">
                  Room Amenities
                </h3>
                <ul className="mt-4 grid gap-2">
                  {room.amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2 text-sm text-ink/75"
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
                <ul className="mt-4 grid gap-2">
                  {room.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-2 text-sm text-ink/75"
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

          {/* RIGHT — sticky sidebar */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
            <div>
              <div className="mb-4 flex items-baseline gap-1 rounded-2xl border border-gold/30 bg-emerald px-6 py-4 text-cream-light shadow-card">
                <span className="font-serif text-3xl font-bold">
                  {room.priceNight}
                </span>
                <span className="text-sm text-cream/80">/ night</span>
              </div>
              <AvailabilityCard roomSlug={room.slug} />
            </div>

            <div className="rounded-2xl border border-gold/30 bg-cream-light p-5 shadow-soft">
              <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-emerald">
                <Phone className="h-5 w-5" /> Need Help?
              </h3>
              <p className="mt-1 text-sm text-ink/65">
                Call us for quick booking assistance.
              </p>
              <a
                href={siteConfig.phones.telPrimary}
                className="mt-2 block font-serif text-2xl font-bold text-ink hover:text-emerald"
              >
                {siteConfig.phones.primary}
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
                  <Check className="h-4 w-4 text-emerald" /> Trusted by 500+ Devotees
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
          </aside>
        </div>
      </section>

      {/* you may also like */}
      <section className="bg-cream-alt py-14 md:py-20">
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
