"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";
import { RevealGroup, fadeUpVariants } from "@/components/reveal";

function Tile({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      variants={fadeUpVariants}
      className="flex flex-col items-center gap-2 rounded-xl border border-gold/30 bg-cream-light px-2 py-4 text-center shadow-soft transition-colors hover:border-gold/70"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15">
        <Icon name={icon} className="h-5 w-5 text-gold-dark" />
      </span>
      <span className="text-xs font-medium leading-tight text-ink/80">
        {label}
      </span>
    </motion.div>
  );
}

export function Facilities({ compact = false }: { compact?: boolean }) {
  return (
    <div id="facilities">
      <SectionHeading
        eyebrow="Amenities"
        title="Our Facilities"
        highlight="Facilities"
        align={compact ? "left" : "center"}
      />

      <RevealGroup
        className={`mt-8 grid gap-3 ${
          compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        }`}
        stagger={0.05}
      >
        {siteConfig.facilities.map((f) => (
          <Tile key={f.label} icon={f.icon} label={f.label} />
        ))}
      </RevealGroup>
    </div>
  );
}
