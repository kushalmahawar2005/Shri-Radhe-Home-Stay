import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star, MessageCircle } from "lucide-react";
import { about } from "@/lib/site-config";
import { getBrand, getContact } from "@/lib/content-store";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { Eyebrow, Flourish } from "@/components/decor";
import { BLUR_DATA_URL } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Shri Radha Home Stay is a family-run homestay in Nathdwara — born out of love and devotion to give pilgrims a peaceful, comfortable stay near Shrinathji Temple.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [brand, contact] = await Promise.all([getBrand(), getContact()]);
  return (
    <>
      {/* ── page header ── */}
      <section className="bg-cream-gradient py-14 md:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-4">
            <Eyebrow>About Us</Eyebrow>
            <h1 className="font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
              About <span className="text-emerald">Us</span>
            </h1>
            <p className="font-serif text-xl italic text-gold-dark">
              {about.tagline}
            </p>
            <p className="max-w-xl leading-relaxed text-ink/75">{about.intro}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/30 shadow-card">
              <Image
                src="/images/building.jpg"
                alt={`${brand.name}, Nathdwara`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── our story ── */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container">
          <SectionHeading eyebrow="Our Journey" title="Our Story" />

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/30 shadow-card">
                <Image
                  src="/images/temple.jpg"
                  alt="Nathdwara temple town"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </figure>
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col gap-4 text-ink/80">
              {about.story.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          {/* story badges */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.storyBadges.map((b, i) => (
              <Reveal
                key={b.title}
                delay={i * 0.06}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-cream-light px-5 py-6 text-center shadow-soft"
              >
                <Icon name={b.icon} className="h-8 w-8 text-gold-dark" />
                <h3 className="font-serif text-base font-semibold text-emerald">
                  {b.title}
                </h3>
                <p className="text-xs text-ink/60">{b.sub}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── meet your hosts ── */}
      <section className="bg-cream-alt py-14 md:py-20">
        <div className="container">
          <SectionHeading eyebrow="The People" title="Meet Your Hosts" />

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <figure className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gold/30 shadow-card">
                <Image
                  src={about.hosts[0].image}
                  alt="The host family of Shri Radha Home Stay"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </figure>
            </Reveal>

            <Reveal delay={0.1} className="rounded-2xl border border-gold/30 bg-cream-light p-7 shadow-card">
              <Flourish className="ml-0" />
              <h3 className="mt-3 font-serif text-2xl font-semibold text-emerald">
                Atithi Devo Bhava
              </h3>
              <p className="text-sm font-medium text-gold-dark">
                (Guest is God)
              </p>
              <p className="mt-4 leading-relaxed text-ink/75">
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
      <section className="bg-cream py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Why Stay With Us"
            title="Our Hospitality Promise"
            highlight="Hospitality"
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {about.promises.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 0.05}
                className="flex items-start gap-4 rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-soft"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald/10">
                  <Icon name={p.icon} className="h-6 w-6 text-emerald" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink/65">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── guest experience / CTA ── */}
      <section className="bg-cream-alt py-14 md:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-gold/30 bg-cream-light p-8 shadow-card">
            <Eyebrow>Guest Experience</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ink">
              Blessings & Comfort, Together
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              The smiles, blessings and happiness of our guests motivate us to
              keep doing better every day.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-gold text-gold" />
              ))}
              <span className="ml-2 text-sm font-medium text-ink/70">
                5 / 5 · Happy Guests
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
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
            <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/30 shadow-card">
              <Image
                src="/images/room-premium.jpg"
                alt="A comfortable room at Shri Radha Home Stay"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </figure>
          </Reveal>
        </div>
      </section>
    </>
  );
}
