"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Bike, Footprints, MapPin } from "lucide-react";
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
    <div className="min-w-0">
      {/* filter tabs */}
      <div role="group" aria-label="Filter places" className="flex max-w-full gap-2 overflow-x-auto py-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {attractionCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={cn(
              "min-h-10 shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald sm:px-4 sm:text-sm",
              active === cat
                ? "border-emerald bg-emerald text-cream-light"
                : "border-gold/40 bg-cream-light text-ink/70 hover:border-emerald hover:text-emerald"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-3 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-col sm:gap-5">
        <AnimatePresence mode="popLayout">
          {list.map((a, i) => (
            <motion.li
              key={a.name}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex min-w-0 flex-col overflow-hidden rounded-[1rem] border border-gold/30 bg-cream-light shadow-soft sm:grid sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:gap-5 sm:rounded-2xl sm:p-4"
            >
              <figure className="relative aspect-[3/2] shrink-0 overflow-hidden sm:aspect-[4/3] sm:rounded-xl sm:border sm:border-gold/20">
                <span className="absolute left-2 top-2 z-10 flex h-6 w-6 sm:left-3 sm:top-3 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-emerald text-xs font-bold text-cream-light shadow">
                  {i + 1}
                </span>
                <Image
                  src={a.image}
                  alt={a.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 639px) 50vw, 180px"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </figure>

              <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-0">
                <div className="flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                  <h2 className="min-h-10 font-serif text-lg font-bold leading-5 text-ink sm:min-h-0 sm:text-2xl sm:leading-tight">
                    {a.name}
                  </h2>
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold-dark sm:px-3 sm:text-xs">
                    {a.category}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs leading-4 text-ink/70 sm:line-clamp-none sm:text-sm sm:leading-relaxed">{a.blurb}</p>

                <div className="mt-auto flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="grid w-full grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-ink/70 sm:flex sm:w-auto sm:flex-wrap sm:gap-x-5 sm:text-sm">
                    <span className="flex items-center gap-1 whitespace-nowrap sm:gap-1.5">
                      <Car className="h-3.5 w-3.5 shrink-0 text-emerald sm:h-4 sm:w-4" /> {a.byCar}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap sm:gap-1.5">
                      <Bike className="h-3.5 w-3.5 shrink-0 text-emerald sm:h-4 sm:w-4" /> {a.byBike}
                    </span>
                    {a.byWalk !== "—" ? (
                      <span className="flex items-center gap-1 whitespace-nowrap sm:gap-1.5">
                        <Footprints className="h-3.5 w-3.5 shrink-0 text-emerald sm:h-4 sm:w-4" /> {a.byWalk}
                      </span>
                    ) : null}
                  </div>

                  <a
                    href={a.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full border border-gold px-2 py-1.5 text-[10px] font-semibold uppercase text-emerald transition-colors hover:bg-gold/10 sm:ml-auto sm:w-auto sm:border-2 sm:px-4 sm:text-sm sm:tracking-wide"
                  >
                    <MapPin className="h-4 w-4" /> View on Map
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
