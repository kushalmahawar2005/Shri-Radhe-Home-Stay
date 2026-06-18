"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading } from "@/components/section-heading";
import { RevealGroup, fadeUpVariants } from "@/components/reveal";
import { BLUR_DATA_URL } from "@/lib/utils";

export function DivineEnergy() {
  return (
    <section id="divine-energy" className="bg-cream py-16 md:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Gallery"
          title="Feel the Divine Energy of Nathdwara"
          highlight="Divine Energy"
        />

        <RevealGroup className="mt-12 grid gap-7 md:grid-cols-3">
          {siteConfig.divineEnergy.map((item) => (
            <motion.figure
              key={item.title}
              variants={fadeUpVariants}
              className="group relative overflow-hidden rounded-2xl border border-gold/30 shadow-card"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-cream-light">
                <h3 className="font-serif text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-cream/85">{item.caption}</p>
              </figcaption>
            </motion.figure>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
