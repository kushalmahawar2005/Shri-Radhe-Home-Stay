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
      className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-[#e7dcc1] bg-[#fffdf7] shadow-[0_16px_42px_-30px_rgba(47,42,31,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_-30px_rgba(47,42,31,0.48)]"
    >
      <div className="relative aspect-[1.32/1] overflow-hidden bg-[#ece3d2]">
        <Image
          src={photo}
          alt={room.alt}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12251c]/55 via-transparent to-[#12251c]/10" aria-hidden="true" />
        <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-[#fffdf2]/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald shadow-sm backdrop-blur-md">
          Room {String(index + 1).padStart(2, "0")}
        </span>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
          <span className="text-sm font-medium drop-shadow">{room.guests}</span>
          <span className="rounded-xl border border-white/25 bg-[#14251e]/70 px-3 py-2 text-right shadow-sm backdrop-blur-md">
            <strong className="block font-serif text-lg leading-none">{room.priceNight}</strong>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.13em] text-white/75">per night</span>
          </span>
        </div>
      </div>
      <div className="h-[3px] w-full" style={{ backgroundColor: accent }} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div>
          <h3 className="font-serif text-[1.7rem] font-semibold leading-tight text-[#33291e]">
            {room.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-[#9b7938]">{room.tagline}</p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/70">{room.blurb}</p>
        </div>

        <ul className="mt-4 flex flex-wrap gap-2">
          {room.features.slice(0, 4).map((feature) => (
            <li
              key={feature}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e5ddc9] bg-[#f7f2e6] px-2.5 py-1.5 text-[11px] font-medium text-[#526257] sm:text-xs"
            >
              <Check className="h-3 w-3 shrink-0 text-emerald" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center gap-3 border-t border-[#eee7d8] pt-5">
          <Button asChild variant="outline" size="sm" className="flex-1 border-[#d3bd83] bg-transparent">
            <Link href={`/rooms/${room.slug}`}>
              View room details <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Link
            href={`/booking?room=${room.slug}`}
            aria-label={`Book ${room.name}`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald text-white shadow-sm transition hover:bg-emerald/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function Rooms({ rooms = siteConfig.rooms }: { rooms?: Room[] }) {
  return (
    <section id="rooms" className="heritage-wash relative overflow-hidden bg-[#f1ead8] py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[#f1ead8]/65" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c6a450]/45 to-transparent" aria-hidden="true" />
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Stay With Us"
          title="A Room for Your Nathdwara Visit"
          highlight="Nathdwara"
          subtitle="Choose a comfortable AC room for a quiet rest between darshan and the next day's journey."
        />

        <RevealGroup className="mt-10 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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
