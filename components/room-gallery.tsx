"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Maximize2, X } from "lucide-react";
import { BLUR_DATA_URL, cn } from "@/lib/utils";

/**
 * Room photo gallery with drag/swipe navigation and selectable thumbnails.
 */
export function RoomGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

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
          className="overflow-hidden rounded-xl"
        >
          <div className="flex">
            {images.map((src, i) => (
              <div
                key={src + i}
                className="relative mr-2 aspect-[3/4] min-w-0 flex-[0_0_74%] overflow-hidden rounded-xl bg-cream-alt sm:flex-[0_0_calc(50%-4px)]"
              >
                <Image
                  src={src}
                  alt={`${name} photo ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 639px) 74vw, (max-width: 1023px) 50vw, 30vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover object-[center_65%]"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="absolute bottom-3 left-3 flex min-h-9 items-center gap-1.5 rounded-full bg-cream-light/95 px-3 text-xs font-medium text-emerald shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              <Maximize2 className="h-3.5 w-3.5" /> Full photo
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/90" />
            <Dialog.Content
              aria-describedby={undefined}
              className="fixed inset-3 z-[71] flex items-center justify-center focus:outline-none sm:inset-8"
            >
              <Dialog.Title className="sr-only">{name} photo {selected + 1}</Dialog.Title>
              <Image
                src={images[selected]}
                alt={`${name} full photo ${selected + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close full photo"
                  className="absolute right-0 top-0 grid h-11 w-11 place-items-center rounded-full bg-cream-light text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* counter */}
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/60 px-3 py-1 text-xs font-medium text-cream-light backdrop-blur-sm">
          {selected + 1} / {images.length}
        </span>
      </div>

      {/* thumbnails */}
      <div className="mt-2 flex gap-2 overflow-x-auto px-1 py-1">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`View photo ${i + 1}`}
            aria-current={selected === i}
            className={cn(
              "relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border transition sm:h-14 sm:w-20",
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
              sizes="80px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover object-[center_65%]"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
