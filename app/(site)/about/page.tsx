import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star, MessageCircle } from "lucide-react";
import { about } from "@/lib/site-config";
import { getBrand, getContact } from "@/lib/content-store";
import { breadcrumbSchema } from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { Eyebrow, Flourish } from "@/components/decor";
import { BLUR_DATA_URL } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Our Family-Run Home Stay in Nathdwara",
  description:
    "Shri Radha Villa Stay is a family-run home stay in Nathdwara — born out of love and devotion to give pilgrims a peaceful, clean and comfortable stay an 8 minute walk from Shrinathji Temple.",
  keywords: [
    "family run homestay Nathdwara",
    "about Shri Radha Villa Stay",
    "trusted home stay Nathdwara",
  ],
  alternates: { canonical: "/about/" },
};

export default async function AboutPage() {
  const [brand, contact] = await Promise.all([getBrand(), getContact()]);
  return (
    <>
      <Schema
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ])}
      />

      {/* ── page header ── */}
      <section className="bg-cream-gradient py-5 sm:py-10 md:py-14">
        <div className="container grid items-center gap-5 sm:gap-8 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-2 sm:gap-4">
            <Eyebrow className="hidden sm:flex">About Us</Eyebrow>
            <h1 className="font-serif text-3xl font-bold leading-tight text-ink sm:text-5xl">
              About <span className="text-emerald">Us</span>
            </h1>
            <p className="font-serif text-base italic text-gold-dark sm:text-xl">
              {about.tagline}
            </p>
            <p className="max-w-xl text-sm leading-6 text-ink/75 sm:text-base">{about.intro}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <figure className="relative aspect-[3/2] overflow-hidden rounded-[1rem] sm:aspect-[4/3] sm:rounded-2xl border border-gold/30 shadow-card">
              <Image
                src="/images/building.jpg"
                alt={`${brand.name}, Nathdwara`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover object-[center_65%]"
              />
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── our story ── */}
      <section className="bg-cream py-6 sm:py-10 md:py-14">
        <div className="container">
          <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Our Story</h2>

          <div className="mt-4 grid items-center gap-4 sm:mt-8 sm:gap-8 lg:grid-cols-2">
            <Reveal>
              <figure className="relative aspect-[3/2] overflow-hidden rounded-[1rem] sm:aspect-[4/3] sm:rounded-2xl border border-gold/30 shadow-card">
                <Image
                  src="/images/rooms/madhuvan/03.webp"
                  alt="Bright Madhuvan room with two double beds at Shri Radha Villa Stay"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover object-[center_65%]"
                />
              </figure>
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col gap-2 text-sm text-ink/80 sm:gap-4 sm:text-base">
              {about.story.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          {/* story badges */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
            {about.storyBadges.map((b, i) => (
              <Reveal
                key={b.title}
                delay={i * 0.06}
                className="flex min-w-0 flex-col items-center gap-1.5 rounded-[1rem] border border-gold/30 bg-cream-light p-3 text-center shadow-soft sm:gap-2 sm:rounded-2xl sm:px-5 sm:py-6"
              >
                <Icon name={b.icon} className="h-6 w-6 text-gold-dark sm:h-8 sm:w-8" />
                <h3 className="font-serif text-base font-semibold leading-5 text-emerald">
                  {b.title}
                </h3>
                <p className="text-[11px] leading-4 text-ink/60 sm:text-xs">{b.sub}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── meet your hosts ── */}
      <section className="bg-cream-alt py-6 sm:py-10 md:py-14">
        <div className="container">
          <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Meet Your Hosts</h2>

          <div className="mt-4 grid items-center gap-4 sm:mt-8 sm:gap-8 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <figure className="relative aspect-[16/9] overflow-hidden rounded-[1rem] sm:aspect-[16/10] sm:rounded-2xl border border-gold/30 shadow-card">
                <Image
                  src={about.hosts[0].image}
                  alt="The host family of Shri Radha Villa Stay"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover object-[center_65%]"
                />
              </figure>
            </Reveal>

            <Reveal delay={0.1} className="rounded-[1rem] border border-gold/30 bg-cream-light p-4 shadow-card sm:rounded-2xl sm:p-7">
              <Flourish className="ml-0 hidden sm:block" />
              <h3 className="font-serif text-xl font-semibold text-emerald sm:mt-3 sm:text-2xl">
                Atithi Devo Bhava
              </h3>
              <p className="text-sm font-medium text-gold-dark">
                (Guest is God)
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/75 sm:mt-4 sm:text-base">
                We are a local family from Nathdwara, deeply connected to the
                temple town and its traditions. Hospitality is not just what we
                do, it is a part of who we are. We personally look after every
                guest and make your visit comfortable, peaceful and memorable.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── hospitality promise ── */}
      <section className="bg-cream py-6 sm:py-10 md:py-14">
        <div className="container">
          <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Our Hospitality Promise</h2>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3">
            {about.promises.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 0.05}
                className="flex min-w-0 flex-col items-start gap-2 rounded-[1rem] border border-gold/30 bg-cream-light p-3 shadow-soft sm:flex-row sm:gap-4 sm:rounded-2xl sm:p-6"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12 bg-emerald/10">
                  <Icon name={p.icon} className="h-5 w-5 text-emerald sm:h-6 sm:w-6" />
                </span>
                <div>
                  <h3 className="font-serif text-base font-semibold leading-5 text-ink sm:text-lg">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-xs leading-4 text-ink/65 sm:text-sm sm:leading-5">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── guest experience / CTA ── */}
      <section className="bg-cream-alt py-6 sm:py-10 md:py-14">
        <div className="container grid items-center gap-5 sm:gap-8 lg:grid-cols-2">
          <Reveal className="rounded-[1rem] border border-gold/30 bg-cream-light p-4 shadow-card sm:rounded-2xl sm:p-8">
            <Eyebrow>Guest Experience</Eyebrow>
            <h2 className="mt-2 font-serif text-2xl font-bold text-ink sm:mt-3 sm:text-3xl">
              Blessings & Comfort, Together
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/75 sm:mt-4 sm:text-base">
              The smiles, blessings and happiness of our guests motivate us to
              keep doing better every day.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:mt-5 sm:gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-gold text-gold" />
              ))}
              <span className="ml-2 text-sm font-medium text-ink/70">
                5 / 5 · Happy Guests
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              <Button asChild variant="primary" size="sm">
                <Link href="/booking">Book Your Stay</Link>
              </Button>
              <Button asChild variant="gold" size="sm">
                <a
                  href={contact.links.whatsappPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <figure className="relative aspect-[3/2] overflow-hidden rounded-[1rem] sm:aspect-[4/3] sm:rounded-2xl border border-gold/30 shadow-card">
              <Image
                src="/images/rooms/makhan-chor/01.webp"
                alt="Makhan Chor room with two double beds and Rajasthani artwork"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover object-[center_65%]"
              />
            </figure>
          </Reveal>
        </div>
      </section>
    </>
  );
}
