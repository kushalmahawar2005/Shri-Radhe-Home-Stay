import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getContact } from "@/lib/content-store";
import { attractions } from "@/lib/site-config";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
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

      <section className="bg-cream-gradient pb-3 pt-5 sm:pb-6 sm:pt-10 md:pt-12">
        <div className="container">
          <h1 className="font-serif text-3xl font-bold leading-tight text-emerald sm:text-4xl">Places to Visit</h1>
          <p className="mt-1 text-sm leading-5 text-ink/65 sm:mt-2 sm:text-base">Temples, heritage and day trips near Nathdwara.</p>
        </div>
      </section>

      <section className="bg-cream pb-10 pt-1 sm:pb-14 sm:pt-4 md:pb-20">
        <div className="container">
          <AttractionsList />
          <p className="mt-5 text-xs leading-5 text-ink/55">
            Photo credits: <a href="https://commons.wikimedia.org/wiki/File:Gateway_To_Temple,_Nathdwara.jpg" className="underline" target="_blank" rel="noopener noreferrer">Shrinathji entrance — Papertree, public domain</a>;{' '}
            <a href="https://commons.wikimedia.org/wiki/File:EklingJi_Temple.jpg" className="underline" target="_blank" rel="noopener noreferrer">Eklingji — Karora23</a>,{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>;{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Lake_Pichola,_Udaipur.jpg" className="underline" target="_blank" rel="noopener noreferrer">Udaipur — Clément Bardot</a>,{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>. Images resized and cropped for display.
          </p>
        </div>
      </section>

      {/* trip-planning CTA */}
      <section className="bg-cream-alt py-5 sm:py-12 md:py-16">
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
