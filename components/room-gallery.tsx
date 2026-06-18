"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BLUR_DATA_URL, cn } from "@/lib/utils";

/**
 * Swipeable room photo gallery — drag/swipe on touch, arrow buttons on
 * desktop, and a thumbnail strip that stays in sync with the active slide.
 */
export function RoomGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div>
      {/* main viewport */}
      <div className="group relative">
        <div
          ref={emblaRef}
          className="overflow-hidden rounded-2xl border border-gold/30 shadow-card"
        >
          <div className="flex">
            {images.map((src, i) => (
              <div
                key={src + i}
                className="relative aspect-[16/10] min-w-0 flex-[0_0_100%]"
              >
                <Image
                  src={src}
                  alt={`${name} photo ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* arrows */}
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-light/90 text-emerald shadow-card ring-1 ring-gold/40 transition hover:bg-cream-light hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-light/90 text-emerald shadow-card ring-1 ring-gold/40 transition hover:bg-cream-light hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* counter */}
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/60 px-3 py-1 text-xs font-medium text-cream-light backdrop-blur-sm">
          {selected + 1} / {images.length}
        </span>
      </div>

      {/* thumbnails */}
      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`View photo ${i + 1}`}
            aria-current={selected === i}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-xl border transition",
              selected === i
                ? "border-emerald ring-2 ring-emerald/40"
                : "border-gold/30 opacity-80 hover:opacity-100"
            )}
          >
            <Image
              src={src}
              alt={`${name} thumbnail ${i + 1}`}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 25vw, 15vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
