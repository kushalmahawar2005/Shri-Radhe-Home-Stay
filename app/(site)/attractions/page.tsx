import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { AttractionsList } from "@/components/attractions-list";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Nearby Attractions",
  description:
    "Explore the divine, historic and naturally beautiful places near Shri Radha Home Stay — Shrinathji Temple, Statue of Belief, Haldighati, Kumbhalgarh Fort, Eklingji and Udaipur.",
  alternates: { canonical: "/attractions" },
};

export default function AttractionsPage() {
  return (
    <>
      <section className="bg-cream-gradient py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Explore Nathdwara"
            title="Nearby Attractions"
            highlight="Attractions"
            subtitle="Explore the divine, historic and naturally beautiful places near Shri Radha Home Stay."
          />
        </div>
      </section>

      <section className="bg-cream py-14 md:py-20">
        <div className="container">
          <AttractionsList />
        </div>
      </section>

      {/* trip-planning CTA */}
      <section className="bg-cream-alt py-12 md:py-16">
        <div className="container flex flex-col items-center justify-between gap-6 rounded-2xl border border-gold/30 bg-cream-light px-8 py-8 text-center shadow-card md:flex-row md:text-left">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">
              Make your stay even more memorable
            </h2>
            <p className="mt-1 text-ink/70">
              We&apos;ll be happy to help you plan darshan, local taxis and
              nearby sightseeing.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="primary" size="sm">
              <Link href="/booking">Plan Your Trip</Link>
            </Button>
            <Button asChild variant="gold" size="sm">
              <a
                href={siteConfig.links.whatsappPrimary}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
