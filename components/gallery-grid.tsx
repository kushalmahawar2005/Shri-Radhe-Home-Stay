"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  galleryImages as defaultGalleryImages,
  galleryCategories,
  type GalleryImage,
} from "@/lib/site-config";
import { BLUR_DATA_URL, cn } from "@/lib/utils";

export function GalleryGrid({
  images: allImages = defaultGalleryImages,
}: {
  images?: GalleryImage[];
}) {
  const [active, setActive] = useState<string>("All");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  // One filter per room (in room order), plus any other group the admin added.
  const present = Array.from(new Set(allImages.map((img) => img.category)));
  const categories = [
    "All",
    ...galleryCategories.filter((cat) => cat !== "All" && present.includes(cat)),
    ...present.filter((cat) => !galleryCategories.includes(cat)),
  ];

  const images =
    active === "All"
      ? allImages
      : allImages.filter((img) => img.category === active);

  return (
    <div className="min-w-0">
      {/* filter tabs */}
      <div role="group" aria-label="Filter photos by room" className="flex max-w-full gap-2 overflow-x-auto py-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={cn(
              "min-h-10 shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 sm:px-4 sm:text-sm",
              active === cat
                ? "border-emerald bg-emerald text-cream-light"
                : "border-gold/40 bg-cream-light text-ink/70 hover:border-emerald hover:text-emerald"
            )}
          >
            {cat === "All" ? "All Photos" : cat}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-2 text-xs text-ink/55 sm:mt-4 sm:text-center sm:text-sm">
        {images.length} photo{images.length === 1 ? "" : "s"}
      </p>

      {/* Uniform tiles: every slot has a fixed shape, so nothing jumps or
          shows as an empty block while photos load. */}
      <motion.div
        layout
        className="mt-3 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {images.map((img, index) => (
            <motion.button
              key={img.src}
              type="button"
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightbox(img)}
              aria-label={`Open photo: ${img.alt}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[0.75rem] border border-gold/30 bg-cream-alt shadow-soft sm:rounded-2xl"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={index < 4}
                loading={index < 4 ? undefined : "lazy"}
                quality={70}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover object-[center_65%] transition-transform duration-500 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-dark/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="pointer-events-none absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-cream-light/90 px-2 py-1 text-[10px] font-medium text-emerald opacity-100 transition-opacity duration-300 sm:bottom-3 sm:left-3 sm:px-3 sm:text-xs sm:opacity-0 sm:group-hover:opacity-100">
                {img.category}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 p-4 backdrop-blur"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-cream-light text-emerald shadow-card"
              onClick={() => setLightbox(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <motion.figure
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-gold/40"
            >
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                width={1280}
                height={960}
                quality={80}
                sizes="(max-width: 1024px) 100vw, 900px"
                className="h-auto max-h-[85vh] w-full object-contain"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-4 text-center text-sm text-cream-light">
                {lightbox.alt}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
