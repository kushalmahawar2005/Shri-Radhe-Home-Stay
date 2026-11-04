"use client";

import { siteConfig } from "@/lib/site-config";
import { Icon } from "@/components/icon";
import { RevealGroup } from "@/components/reveal";
import { fadeUpVariants } from "@/components/reveal";
import { motion } from "framer-motion";

export function GreenBand() {
  return (
    <section
      aria-label="Stay highlights"
      className="relative overflow-hidden border-y border-[#caa856]/45 bg-[#1e4a3c] text-[#fff8e9]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_50%,rgba(216,184,112,0.15),transparent_30%),radial-gradient(ellipse_at_92%_10%,rgba(255,255,255,0.06),transparent_32%)]" aria-hidden="true" />
      <div className="container relative grid gap-8 py-9 md:grid-cols-[0.8fr_2fr] md:items-center md:gap-12 md:py-11">
        <div className="max-w-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e1c57f]">The little comforts</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight text-[#fff8e9] sm:text-3xl">
            Make more room for darshan.
          </h2>
        </div>

        <RevealGroup className="grid grid-cols-2 gap-x-5 gap-y-6 lg:grid-cols-4 lg:gap-5">
          {siteConfig.highlights.map((highlight) => (
            <motion.div
              key={highlight.label}
              variants={fadeUpVariants}
              className="flex items-center gap-3 border-l border-[#e1c57f]/35 pl-3 sm:pl-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#e1c57f]/40 bg-white/[0.06] text-[#f0d487]">
                <Icon name={highlight.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-serif text-base font-semibold leading-tight text-[#fff8e9] sm:text-lg">
                  {highlight.label}
                </span>
                <span className="mt-1 block text-xs text-[#fff8e9]/65 sm:text-sm">
                  {highlight.sub}
                </span>
              </span>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
