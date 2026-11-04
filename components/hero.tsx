"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarCheck, MapPin, Wifi } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { BLUR_DATA_URL } from "@/lib/utils";

/** Property photographs supplied by the owners. */
const HERO_SLIDES = [
  { src: "/images/room-family-enhanced.webp", alt: "A bright family room with a comfortable bed and sitting area" },
  { src: "/images/room-deluxe-enhanced.webp", alt: "A spacious guest room with a bed and sofa" },
  { src: "/images/room-premium-enhanced.webp", alt: "A colourful family room at Shri Radha Villa Stay" },
  { src: "/images/r2.jpg", alt: "An air-conditioned room with thoughtful furnishings" },
  { src: "/images/02.jpg", alt: "A welcoming room with a sitting area for guests" },
  { src: "/images/03.jpg", alt: "A comfortable guest room in Nathdwara" },
];

export function Hero() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((current) => (current + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative isolate overflow-hidden bg-[#fbf7ed]" aria-labelledby="hero-heading">
      {/* Airy Pichwai-inspired sunrise, birds, lotus and foliage frame the headline. */}
      <Image
        src="/images/nathdwara-watercolor.webp"
        alt=""
        aria-hidden="true"
        width={2172}
        height={724}
        priority
        className="hero-art-fade pointer-events-none absolute inset-x-0 top-0 z-0 h-[190px] w-full object-cover object-top opacity-75 sm:h-[220px] md:h-[240px]"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,253,247,0.12),#fbf7ed_255px)]" />

      <div className="container relative z-10 pb-10 pt-6 sm:pt-9 md:pb-14 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-[#fffdf7]/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.19em] text-emerald shadow-sm backdrop-blur-sm sm:text-xs">
            <MapPin className="h-3.5 w-3.5 text-gold-dark" aria-hidden="true" />
            Nathdwara, Rajasthan
            <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
            Shri Radha Villa Stay
          </p>

          <h1 id="hero-heading" className="mx-auto mt-4 max-w-4xl font-serif text-[2.55rem] font-bold leading-[1.04] tracking-[-0.035em] text-emerald sm:text-5xl md:text-[3.55rem]">
            Stay close to Shrinathji.
            <span className="mt-1 block font-normal italic text-[#a67f2d]">Feel at home in Nathdwara.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-ink/75 sm:text-base sm:leading-7">
            A warm, family-friendly home stay for your Nathdwara visit — with comfortable AC rooms and an easy walk to the temple.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="primary" size="lg" className="shadow-soft">
              <Link href="/booking">
                <CalendarCheck className="h-4 w-4" />
                Plan Your Stay
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/70">
              <Link href="/rooms">
                Explore Our Rooms
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* A compact collage makes the owners' actual rooms the main visual. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 grid max-w-5xl gap-3 sm:mt-8 sm:grid-cols-[1.5fr_0.82fr] sm:gap-4"
        >
          <div className="group relative min-h-[260px] overflow-hidden rounded-[1.6rem] border-[5px] border-white bg-[#eee5d2] shadow-[0_25px_65px_-36px_rgba(39,50,35,0.55)] sm:min-h-[340px] md:min-h-[385px] md:rounded-[2rem] md:border-[7px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0"
              >
                <Image
                  src={HERO_SLIDES[slide].src}
                  alt={HERO_SLIDES[slide].alt}
                  fill
                  priority={slide === 0}
                  sizes="(max-width: 768px) 100vw, 65vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#13251d]/75 to-transparent" aria-hidden="true" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/25 bg-[#15281f]/75 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md sm:bottom-5 sm:left-5 sm:px-4 sm:text-sm">
              <MapPin className="h-4 w-4 text-[#e6c56f]" aria-hidden="true" />
              {siteConfig.templeWalkTime} to Shrinathji Temple
            </div>
            <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/40 bg-[#fffdf7]/90 px-3 py-2 shadow-sm backdrop-blur-md" aria-label={`Photo ${slide + 1} of ${HERO_SLIDES.length}`}>
              {HERO_SLIDES.map((photo, i) => (
                <button
                  key={photo.src}
                  type="button"
                  aria-label={`Show room photo ${i + 1}`}
                  aria-pressed={i === slide}
                  onClick={() => setSlide(i)}
                  className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${i === slide ? "w-5 bg-emerald" : "w-2 bg-emerald/30 hover:bg-emerald/60"}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-4">
            <div className="group relative min-h-[150px] overflow-hidden rounded-[1.35rem] border-[5px] border-white bg-[#eee5d2] shadow-card sm:min-h-0 sm:flex-1 sm:rounded-[1.6rem] sm:border-[6px]">
              <Image src="/images/room-deluxe-enhanced.webp" alt="A welcoming room with a comfortable bed and seating" fill sizes="(max-width: 768px) 50vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#13251d]/75 to-transparent px-3 pb-3 pt-9 text-xs font-semibold text-white sm:px-4 sm:pb-4 sm:text-sm">Comfort for the whole family</div>
            </div>
            <div className="group relative min-h-[150px] overflow-hidden rounded-[1.35rem] border-[5px] border-white bg-[#eee5d2] shadow-card sm:min-h-0 sm:flex-1 sm:rounded-[1.6rem] sm:border-[6px]">
              <Image src="/images/room-premium-enhanced.webp" alt="One of the colourful rooms at Shri Radha Villa Stay" fill sizes="(max-width: 768px) 50vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#13251d]/75 to-transparent px-3 pb-3 pt-9 text-xs font-semibold text-white sm:px-4 sm:pb-4 sm:text-sm">Real rooms, a warm welcome</div>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto mt-5 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-2 border-t border-gold/20 pt-4 text-xs font-medium text-ink/70 sm:gap-x-9 sm:text-sm">
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-gold-dark" aria-hidden="true" />8-minute temple walk</span>
          <span className="inline-flex items-center gap-2"><Wifi className="h-4 w-4 text-gold-dark" aria-hidden="true" />Free WiFi</span>
          <span className="inline-flex items-center gap-2">AC rooms · Attached bathrooms</span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[min(88%,1100px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/35 to-transparent" aria-hidden="true" />
    </section>
  );
}
