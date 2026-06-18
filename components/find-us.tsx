import { Phone, MapPin, Instagram, Navigation } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function FindUs() {
  const { address, phones, links } = siteConfig;
  return (
    <section id="find-us" className="bg-cream-alt py-16 md:py-24">
      <div className="container">
        <SectionHeading eyebrow="Location" title="Find Us Here" highlight="Here" />

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* details */}
          <Reveal className="flex flex-col justify-center rounded-2xl border border-gold/30 bg-cream-light p-7 shadow-card">
            <h3 className="font-serif text-2xl font-semibold text-emerald">
              {siteConfig.name}
            </h3>

            <ul className="mt-5 space-y-4 text-ink/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
                <span>{address.full}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-gold-dark" />
                <span className="flex flex-wrap gap-x-2">
                  <a className="hover:text-emerald" href={phones.telPrimary}>
                    {phones.primary}
                  </a>
                  <span aria-hidden="true">·</span>
                  <a className="hover:text-emerald" href={phones.telSecondary}>
                    {phones.secondary}
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="h-5 w-5 shrink-0 text-gold-dark" />
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald"
                >
                  {links.instagramHandle}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="primary" size="sm">
                <a href={phones.telPrimary}>
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a
                  href={links.mapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>
              </Button>
            </div>
          </Reveal>

          {/* map */}
          <Reveal
            delay={0.1}
            className="overflow-hidden rounded-2xl border border-gold/30 shadow-card"
          >
            <iframe
              title={`Map showing ${siteConfig.name} in Nathdwara`}
              src={links.mapsEmbed}
              className="h-full min-h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
