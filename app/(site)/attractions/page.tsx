import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getContact } from "@/lib/content-store";
import { attractions } from "@/lib/site-config";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { AttractionsList } from "@/components/attractions-list";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Places to Visit in Nathdwara & Nearby",
  description:
    "Tourist places near Nathdwara with real distances and travel times — Shrinathji Temple (8 min walk), Statue of Belief, Haldighati, Kumbhalgarh Fort, Eklingji Temple and Udaipur.",
  keywords: [
    "places to visit in Nathdwara",
    "Nathdwara tourist places",
    "Statue of Belief Nathdwara distance",
    "Haldighati from Nathdwara",
    "Kumbhalgarh Fort from Nathdwara",
    "Nathdwara sightseeing",
  ],
  alternates: { canonical: "/attractions/" },
};

export default async function AttractionsPage() {
  const contact = await getContact();
  // An ItemList of TouristAttraction entities — this is what lets Google
  // surface the page for "places to visit in Nathdwara" style queries.
  const attractionsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Places to visit near Nathdwara",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: attractions.length,
    itemListElement: attractions.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "TouristAttraction",
        name: a.name,
        description: a.blurb,
        image: `${SITE_URL}${a.image}`,
        url: a.mapUrl,
        touristType: "Pilgrims and heritage travellers",
        address: {
          "@type": "PostalAddress",
          addressRegion: "Rajasthan",
          addressCountry: "IN",
        },
      },
    })),
  };

  return (
    <>
      <Schema data={attractionsSchema} />
      <Schema
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Nearby Attractions", path: "/attractions" },
        ])}
      />

      <section className="bg-cream-gradient py-14 md:py-20">
        <div className="container">
          <SectionHeading
            as="h1"
            eyebrow="Explore Nathdwara"
            title="Places to Visit In and Around Nathdwara"
            highlight="Places to Visit"
            subtitle="Explore the divine, historic and naturally beautiful places near Shri Radha Villa Stay."
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
                href={contact.links.whatsappPrimary}
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
