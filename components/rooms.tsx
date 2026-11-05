"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Check } from "lucide-react";
import { siteConfig, type Room } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup } from "@/components/reveal";
import { fadeUpVariants } from "@/components/reveal";
import { motion } from "framer-motion";
import { BLUR_DATA_URL } from "@/lib/utils";

const ENHANCED_PHOTOS_BY_SOURCE: Record<string, string> = {
  "/images/01.jpg": "/images/room-deluxe-enhanced.webp",
  "/images/r1.jpg": "/images/room-family-enhanced.webp",
  "/images/c1.jpg": "/images/room-premium-enhanced.webp",
};

// Accents sample the maroon, temple-gold and soft-plum details in the room references.
const ROOM_ACCENTS = ["#985748", "#b49445", "#88728e"];

function RoomCard({ room, index }: { room: Room; index: number }) {
  const photo = ENHANCED_PHOTOS_BY_SOURCE[room.image] ?? room.image;
  const accent = ROOM_ACCENTS[index % ROOM_ACCENTS.length];
  return (
    <motion.article
      variants={fadeUpVariants}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1rem] border border-[#e7dcc1] bg-[#fffdf7] shadow-[0_16px_42px_-30px_rgba(47,42,31,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_-30px_rgba(47,42,31,0.48)] sm:rounded-[1.6rem]"
    >
      <div className="relative aspect-[1.32/1] overflow-hidden bg-[#ece3d2]">
        <Image
          src={photo}
          alt={room.alt}
          fill
          loading="lazy"
          sizes="(max-width: 1023px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12251c]/55 via-transparent to-[#12251c]/10" aria-hidden="true" />
        <span className="absolute left-2 top-2 rounded-full border border-white/60 bg-[#fffdf2]/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-emerald shadow-sm backdrop-blur-md sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.12em]">
          Room {String(index + 1).padStart(2, "0")}
        </span>
        <div className="absolute bottom-4 left-4 right-4 hidden items-end justify-between gap-3 text-white sm:flex">
          <span className="text-[10px] font-medium drop-shadow sm:text-sm">{room.guests}</span>
          <span className="rounded-lg border border-white/25 bg-[#14251e]/70 px-2 py-1.5 text-right shadow-sm backdrop-blur-md sm:rounded-xl sm:px-3 sm:py-2">
            <strong className="block font-serif text-sm leading-none sm:text-lg">{room.priceNight}</strong>
            <span className="mt-1 block text-[8px] uppercase tracking-[0.1em] text-white/75 sm:text-[10px] sm:tracking-[0.13em]">per night</span>
          </span>
        </div>
      </div>
      <div className="h-[3px] w-full" style={{ backgroundColor: accent }} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-3 sm:p-6">
        <div>
          <h3 className="font-serif text-[20px] font-semibold leading-5 text-[#33291e] sm:text-[1.7rem] sm:leading-tight">
            {room.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs font-medium leading-4 text-[#9b7938] sm:text-sm sm:leading-5">{room.tagline}</p>
          <p className="mt-3 hidden text-sm leading-6 text-ink/70 sm:line-clamp-2">{room.blurb}</p>
        </div>

        <p className="mt-2 text-xs leading-4 text-[#526257] sm:hidden">
          <span className="font-semibold">{room.features[0]}</span>
          <span className="mx-1" aria-hidden="true">·</span>
          {room.guests}
        </p>

        <ul className="mt-4 hidden flex-wrap gap-2 sm:flex">
          {room.features.slice(0, 4).map((feature) => (
            <li
              key={feature}
              className="inline-flex items-center gap-1 rounded-full border border-[#e5ddc9] bg-[#f7f2e6] px-2 py-1 text-[9px] font-medium leading-4 text-[#526257] sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs"
            >
              <Check className="h-2.5 w-2.5 shrink-0 text-emerald sm:h-3 sm:w-3" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mb-2 mt-2 flex flex-wrap items-baseline gap-x-1 text-emerald sm:hidden">
          <strong className="font-serif text-xl font-semibold leading-6">{room.priceNight}</strong>
          <span className="text-[11px] text-ink/60">/ night</span>
        </div>

        <div className="mt-auto flex items-center gap-3 border-t border-[#eee7d8] pt-2 sm:pt-5">
          <Button asChild variant="outline" size="sm" className="h-10 min-w-0 flex-1 gap-1 border-[#d3bd83] bg-transparent px-2 text-[11px] tracking-normal sm:h-9 sm:gap-2 sm:px-4 sm:text-sm sm:tracking-wide">
            <Link href={`/rooms/${room.slug}`} aria-label={`View ${room.name} room details`}>
              <span className="sm:hidden">View details</span>
              <span className="hidden sm:inline">View room details</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </Button>
          <Link
            href={`/booking?room=${room.slug}`}
            aria-label={`Book ${room.name}`}
            className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald text-white shadow-sm transition hover:bg-emerald/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:grid"
          >
            <CalendarCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function Rooms({ rooms = siteConfig.rooms }: { rooms?: Room[] }) {
  return (
    <section id="rooms" className="heritage-wash relative overflow-hidden bg-[#f1ead8] py-5 sm:py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[#f1ead8]/65" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c6a450]/45 to-transparent" aria-hidden="true" />
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Stay With Us"
          title="A Room for Your Nathdwara Visit"
          highlight="Nathdwara"
          subtitle="Choose a comfortable AC room for a quiet rest between darshan and the next day's journey."
        />

        <RevealGroup className="mt-5 sm:mt-10 grid grid-cols-2 items-stretch gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {rooms.map((room, index) => (
            <RoomCard key={room.slug} room={room} index={index} />
          ))}
        </RevealGroup>

        <Reveal className="mt-9 flex justify-center">
          <Button asChild variant="outline" className="bg-[#fffdf7]/75">
            <Link href="/rooms">
              Compare all room details <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
