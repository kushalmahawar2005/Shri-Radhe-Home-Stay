"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle, ArrowRight, CalendarCheck } from "lucide-react";
import { siteConfig, type Room } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup } from "@/components/reveal";
import { fadeUpVariants } from "@/components/reveal";
import { motion } from "framer-motion";
import { BLUR_DATA_URL } from "@/lib/utils";

function RoomCard({ room }: { room: Room }) {
  return (
    <motion.article
      variants={fadeUpVariants}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gold/30 bg-cream-light shadow-card transition-shadow hover:shadow-nav"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={room.image}
          alt={room.alt}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute right-3 top-3 rounded-full bg-emerald/90 px-3 py-1 text-xs font-semibold text-cream-light">
          {room.priceNight} / night
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-2xl font-semibold text-ink">
          {room.name}
        </h3>

        <ul className="mt-3 flex-1 space-y-2">
          {room.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-ink/75">
              <Check className="h-4 w-4 shrink-0 text-emerald" />
              {f}
            </li>
          ))}
        </ul>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary" size="sm" className="mt-5 w-full">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="relative -mx-6 -mt-6 mb-2 aspect-[16/9] overflow-hidden sm:rounded-t-2xl">
              <Image
                src={room.image}
                alt={room.alt}
                fill
                sizes="512px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>
            <DialogHeader>
              <DialogTitle>{room.name}</DialogTitle>
              <DialogDescription>{room.blurb}</DialogDescription>
            </DialogHeader>
            <ul className="grid grid-cols-2 gap-2">
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
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gold/30 pt-4">
              <span className="text-sm text-ink/70">
                <strong className="font-serif text-lg text-emerald">
                  {room.priceNight}
                </strong>{" "}
                / night
              </span>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/rooms/${room.slug}`}>
                    Full Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="primary" size="sm">
                  <Link href={`/booking?room=${room.slug}`}>
                    <CalendarCheck className="h-4 w-4" />
                    Book Now
                  </Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.article>
  );
}

export function Rooms({ rooms = siteConfig.rooms }: { rooms?: Room[] }) {
  return (
    <section id="rooms" className="bg-cream-alt py-16 md:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Stay With Us"
          title="Our Comfortable Rooms"
          highlight="Comfortable"
          subtitle="Three thoughtfully kept AC rooms — each with an attached bathroom, 24x7 hot water and free WiFi."
        />

        <RevealGroup className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.slug} room={room} />
          ))}
        </RevealGroup>

        <Reveal className="mt-10 flex justify-center">
          <Button asChild variant="outline">
            <a href="/rooms">
              View All Room Details
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
