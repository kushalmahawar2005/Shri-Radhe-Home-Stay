"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading } from "@/components/section-heading";
import { RevealGroup, fadeUpVariants } from "@/components/reveal";

export function DivineEnergy() {
  return (
    <section id="divine-energy" className="relative overflow-hidden bg-[#fffdf7] py-5 sm:py-16 md:py-20">
      <div className="container">
        <SectionHeading
          eyebrow="A little Nathdwara magic"
          title="A Town Filled With Art & Devotion"
          highlight="Art & Devotion"
          subtitle="From the first darshan to the colours of Pichwai, Nathdwara has a beauty all its own."
        />

        <RevealGroup className="mt-5 sm:mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {siteConfig.divineEnergy.map((item, index) => (
            <motion.figure
              key={item.title}
              variants={fadeUpVariants}
              className="group overflow-hidden rounded-[1.6rem] border border-[#e7dcc1] bg-[#f8f2e6] shadow-[0_16px_42px_-30px_rgba(47,42,31,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_-30px_rgba(47,42,31,0.48)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#eee4ce]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                />
                <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/55 bg-[#fffdf2]/85 font-serif text-sm font-semibold text-emerald shadow-sm backdrop-blur-sm">
                  0{index + 1}
                </span>
              </div>
              <figcaption className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                <h3 className="font-serif text-xl font-semibold leading-tight text-[#33291e] sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/70">{item.caption}</p>
              </figcaption>
            </motion.figure>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
