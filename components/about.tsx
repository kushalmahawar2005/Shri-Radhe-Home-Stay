import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { PeacockFeather, Lotus } from "@/components/decor";
import { BLUR_DATA_URL } from "@/lib/utils";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-cream py-16 md:py-24">
      <PeacockFeather className="pointer-events-none absolute -right-6 top-16 h-72 opacity-[0.08]" />

      <div className="container">
        <SectionHeading
          eyebrow="About Us"
          title="A Divine Stay in Nathdwara"
          highlight="Divine"
        />

        <div className="mt-12 grid items-center gap-10 md:grid-cols-2 md:gap-14">
          {/* building photo */}
          <Reveal className="group relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-gold/40 shadow-card">
              <Image
                src="/images/building.jpg"
                alt="Exterior of the Shri Radha Home Stay building in Nathdwara"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <Lotus className="absolute -bottom-5 left-6 h-10 w-16" />
          </Reveal>

          {/* text + pills */}
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-ink/80">
              Located near Shrinathji Temple, Shri Radha Home Stay offers a
              peaceful and comfortable environment for devotees and travellers
              visiting Nathdwara. Enjoy spotless AC rooms, 24x7 hot water,
              free WiFi and the warmth of a true home — just a short walk from
              the temple.
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {siteConfig.aboutFeatures.map((feature) => (
                <li
                  key={feature.label}
                  className="flex items-center gap-2 rounded-full border border-gold/30 bg-cream-light px-3 py-2 text-sm text-ink/80 shadow-soft"
                >
                  <Icon name={feature.icon} className="h-4 w-4 shrink-0 text-gold-dark" />
                  <span className="leading-tight">{feature.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
