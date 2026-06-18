"use client";

import { Star, Quote } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export function Testimonials({ compact = false }: { compact?: boolean }) {
  return (
    <div id="testimonials">
      <SectionHeading
        eyebrow="Reviews"
        title="What Our Guests Say"
        highlight="Guests"
        align={compact ? "left" : "center"}
      />

      <Reveal className="mt-8">
        <Carousel opts={{ loop: true }} className="mx-auto max-w-xl">
          <CarouselContent>
            {siteConfig.testimonials.map((t, i) => (
              <CarouselItem key={i}>
                <figure className="relative rounded-2xl border border-gold/30 bg-cream-light p-6 text-center shadow-card">
                  <Quote
                    className="mx-auto mb-3 h-7 w-7 text-gold/60"
                    aria-hidden="true"
                  />
                  <div
                    className="mb-3 flex justify-center"
                    aria-label={`${t.rating} out of 5 stars`}
                  >
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-lg italic leading-relaxed text-ink/85">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4">
                    <span className="block font-semibold text-emerald">
                      {t.author}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-gold-dark">
                      {t.location}
                    </span>
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-5 flex items-center justify-center gap-3">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </Reveal>
    </div>
  );
}
