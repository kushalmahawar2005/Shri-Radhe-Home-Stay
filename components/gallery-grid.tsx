"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  galleryImages,
  galleryCategories,
  type GalleryImage,
} from "@/lib/site-config";
import { BLUR_DATA_URL, cn } from "@/lib/utils";

export function GalleryGrid() {
  const [active, setActive] = useState<(typeof galleryCategories)[number]>("All");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const images =
    active === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === active);

  return (
    <div>
      {/* filter tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {galleryCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === cat
                ? "border-emerald bg-emerald text-cream-light"
                : "border-gold/40 bg-cream-light text-ink/70 hover:border-emerald hover:text-emerald"
            )}
          >
            {cat === "All" ? "All Photos" : cat}
          </button>
        ))}
      </div>

      {/* masonry-ish grid */}
      <motion.div
        layout
        className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4"
      >
        <AnimatePresence mode="popLayout">
          {images.map((img) => (
            <motion.button
              key={img.src}
              type="button"
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightbox(img)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-gold/30 shadow-soft"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={450}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-dark/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-cream-light/90 px-3 py-1 text-xs font-medium text-emerald opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
