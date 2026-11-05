import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getGallery, getContact } from "@/lib/content-store";
import { breadcrumbSchema } from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/components/gallery-grid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Room Photos — All 7 Rooms",
  description:
    "Real photos of all 7 AC & non-AC rooms at Shri Radha Villa Stay, Nathdwara — Radha Rani, Makhan Chor, Bal Gopal, Madhuvan, Radhika Rajkunj, Kishori Kripa and Kanupriya. See exactly what you are booking.",
  keywords: [
    "Nathdwara hotel photos",
    "home stay Nathdwara room images",
    "Nathdwara room photos",
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

      <section className="bg-cream-gradient pb-3 pt-5 sm:pb-6 sm:pt-10 md:pb-8 md:pt-12">
        <div className="container">
          <h1 className="font-serif text-3xl font-bold leading-tight text-emerald sm:text-4xl">
            Room Photos
          </h1>
          <p className="mt-1 text-sm leading-5 text-ink/65 sm:mt-2 sm:text-base">
            Explore all 7 rooms. Tap a photo to enlarge.
          </p>
        </div>
      </section>

      <section className="bg-cream pb-10 pt-1 sm:pt-4 md:pb-20">
        <div className="container">
          <GalleryGrid images={images} />
        </div>
      </section>

      {/* capture moments CTA */}
      <section className="bg-cream-alt py-5 sm:py-12 md:py-16">
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
