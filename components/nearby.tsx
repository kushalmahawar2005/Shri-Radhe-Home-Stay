"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading } from "@/components/section-heading";
import { RevealGroup, fadeUpVariants } from "@/components/reveal";
import { BLUR_DATA_URL } from "@/lib/utils";

export function Nearby({ compact = false }: { compact?: boolean }) {
  return (
    <div id="nearby">
      <SectionHeading
        eyebrow="Explore"
        title="Nearby Attractions"
        highlight="Attractions"
        align={compact ? "left" : "center"}
      />

      <RevealGroup
        className={`mt-8 grid gap-4 ${
          compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {siteConfig.nearby.map((place) => (
          <motion.article
            key={place.name}
            variants={fadeUpVariants}
            className="group relative overflow-hidden rounded-xl border border-gold/30 shadow-soft"
          >
            <div className="relative aspect-square">
              <Image
                src={place.image}
                alt={place.alt}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 25vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3 text-cream-light">
              <h3 className="font-serif text-base font-semibold leading-tight">
                {place.name}
              </h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-gold-light">
                <MapPin className="h-3 w-3" />
                {place.distance}
              </p>
            </div>
          </motion.article>
        ))}
      </RevealGroup>
    </div>
  );
}
