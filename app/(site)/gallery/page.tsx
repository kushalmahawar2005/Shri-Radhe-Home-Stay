import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getGallery, getContact } from "@/lib/content-store";
import { breadcrumbSchema } from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { GalleryGrid } from "@/components/gallery-grid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Photo Gallery — Rooms, Terrace & Temple Views",
  description:
    "Real photos of Shri Radha Villa Stay, Nathdwara — AC rooms, attached bathrooms, terrace, reception, the building and Shrinathji Temple surroundings. See exactly what you are booking.",
  keywords: [
    "Nathdwara hotel photos",
    "home stay Nathdwara room images",
    "Shrinathji Temple area photos",
  ],
  alternates: { canonical: "/gallery/" },
};

export default async function GalleryPage() {
  const [images, contact] = await Promise.all([getGallery(), getContact()]);
  return (
    <>
      <Schema
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />

      <section className="bg-cream-gradient py-14 md:py-20">
        <div className="container">
          <SectionHeading
            as="h1"
            eyebrow="Our Moments"
            title="Photo Gallery — Our Home Stay in Nathdwara"
            highlight="Photo Gallery"
            subtitle="Explore the beauty, comfort and spiritual essence of Shri Radha Villa Stay and Nathdwara."
          />
        </div>
      </section>

      <section className="bg-cream py-14 md:py-20">
        <div className="container">
          <GalleryGrid images={images} />
        </div>
      </section>

      {/* capture moments CTA */}
      <section className="bg-cream-alt py-12 md:py-16">
        <div className="container flex flex-col items-center justify-between gap-6 rounded-2xl border border-gold/30 bg-cream-light px-8 py-8 text-center shadow-card md:flex-row md:text-left">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">
              Capture Memories, Cherish Moments
            </h2>
            <p className="mt-1 text-ink/70">
              Experience peace, devotion and comfort at Shri Radha Villa Stay.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="primary" size="sm">
              <Link href="/booking">Book Your Stay</Link>
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
