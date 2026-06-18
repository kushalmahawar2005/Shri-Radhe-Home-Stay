"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Bike, Footprints, MapPin, ArrowRight } from "lucide-react";
import {
  attractions,
  attractionCategories,
} from "@/lib/site-config";
import { BLUR_DATA_URL, cn } from "@/lib/utils";

export function AttractionsList() {
  const [active, setActive] =
    useState<(typeof attractionCategories)[number]>("All Places");

  const list =
    active === "All Places"
      ? attractions
      : attractions.filter((a) => a.category === active);

  return (
    <div>
      {/* filter tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {attractionCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === cat
                ? "border-emerald bg-emerald text-cream-light"
                : "border-gold/40 bg-cream-light text-ink/70 hover:border-emerald hover:text-emerald"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-10 flex flex-col gap-5">
        <AnimatePresence mode="popLayout">
          {list.map((a, i) => (
            <motion.li
              key={a.name}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid gap-5 rounded-2xl border border-gold/30 bg-cream-light p-4 shadow-soft sm:grid-cols-[220px_1fr] sm:items-center"
            >
              <figure className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gold/20">
                <span className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-emerald text-xs font-bold text-cream-light shadow">
                  {i + 1}
                </span>
                <Image
                  src={a.image}
                  alt={a.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 220px"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </figure>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-serif text-2xl font-bold text-ink">
                    {a.name}
                  </h2>
                  <span className="rounded-full bg-gold/15 px-3 py-0.5 text-xs font-medium text-gold-dark">
                    {a.category}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-ink/70">{a.blurb}</p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/70">
                    <span className="flex items-center gap-1.5">
                      <Car className="h-4 w-4 text-emerald" /> {a.byCar}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bike className="h-4 w-4 text-emerald" /> {a.byBike}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Footprints className="h-4 w-4 text-emerald" /> {a.byWalk}
                    </span>
                  </div>

                  <a
                    href={a.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full border-2 border-gold px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-emerald transition-colors hover:bg-gold/10"
                  >
                    <MapPin className="h-4 w-4" /> View on Map
                  </a>
                  <a
                    href={a.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-cream-light transition-colors hover:bg-emerald-dark"
                  >
                    View Details <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
