"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarCheck, ArrowRight, Star } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { HangingBells, PeacockFeather, TempleLineArt } from "@/components/decor";
import { BLUR_DATA_URL } from "@/lib/utils";

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-cream-gradient"
      aria-labelledby="hero-heading"
    >
      {/* background ghat photo */}
      <Image
        src="/images/hero.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover"
      />
      {/* readability overlay — light on the left, fading toward the right */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-cream-light via-cream-light/85 to-cream-light/40 md:to-transparent" />

      {/* faint temple/ghat line-art behind the left column */}
      <TempleLineArt
        className="pointer-events-none absolute -left-10 top-10 h-[420px] w-[420px] opacity-[0.06]"
      />
      <PeacockFeather className="pointer-events-none absolute bottom-0 left-[36%] hidden h-[300px] opacity-20 md:block" />
      {/* hanging bells on the hero edge */}
      <HangingBells className="pointer-events-none absolute right-2 top-0 z-10 h-28 w-24 md:right-8" />

      <div className="container relative z-10 grid items-center gap-10 py-14 md:grid-cols-2 md:py-20 lg:gap-14">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <h1
            id="hero-heading"
            className="font-serif text-5xl font-bold leading-[1.04] text-ink sm:text-6xl lg:text-7xl"
          >
            Shri Radha
            <br />
            Home Stay
          </h1>

          <p className="mt-4 font-serif text-2xl italic text-gold-dark sm:text-3xl">
            {siteConfig.tagline}
          </p>

          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/75">
            {siteConfig.intro}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button asChild variant="primary" size="lg" className="w-full sm:w-auto">
              <Link href="/booking">
                <CalendarCheck className="h-4 w-4" />
                Book Your Stay
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/rooms">
                Explore Rooms
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-cream-light shadow-card ring-1 ring-gold/40">
            <Image
              src="/images/03.jpg"
              alt="Comfortable AC room with a temple-town view at Shri Radha Home Stay"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover"
            />
          </div>

          {/* gold trust badge */}
          <div className="absolute right-4 top-4 flex flex-col items-center rounded-xl border border-gold/50 bg-emerald/95 px-4 py-2 text-cream-light shadow-soft">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </span>
            <span className="mt-1 text-xs font-semibold tracking-wide">
              Trusted by Pilgrims
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
