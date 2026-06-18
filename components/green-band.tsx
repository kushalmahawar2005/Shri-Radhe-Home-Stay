"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { Icon } from "@/components/icon";
import { Toran } from "@/components/decor";
import { RevealGroup } from "@/components/reveal";
import { fadeUpVariants } from "@/components/reveal";
import { motion } from "framer-motion";

export function GreenBand() {
  return (
    <section
      aria-label="Highlights"
      className="relative bg-emerald text-cream-light"
    >
      <Toran className="absolute inset-x-0 top-0 h-6 w-full text-gold/60" />

      {/* Bal Krishna — half inside the band, half rising above it */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 hidden h-80 w-52 md:block lg:left-[2%]">
        <Image
          src="/images/krishna.png"
          alt="Bal Krishna with butter pot"
          fill
          sizes="220px"
          className="object-contain object-bottom drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
        />
      </div>

      <div className="container grid items-center gap-8 py-12 md:grid-cols-[auto,1fr] md:py-14">
        {/* spacer reserving room for the Krishna illustration */}
        <div className="hidden h-44 w-48 md:block" aria-hidden="true" />

        <RevealGroup className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {siteConfig.highlights.map((h) => (
            <motion.div
              key={h.label}
              variants={fadeUpVariants}
              className="flex flex-col items-center gap-2 text-center md:items-start md:text-left"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-emerald-light/40">
                <Icon name={h.icon} className="h-6 w-6 text-gold-light" />
              </span>
              <span className="mt-1 font-serif text-lg font-semibold text-cream-light">
                {h.label}
              </span>
              <span className="text-sm text-cream/70">{h.sub}</span>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
