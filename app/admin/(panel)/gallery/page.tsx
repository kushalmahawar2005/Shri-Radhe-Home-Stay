import { Trash2 } from "lucide-react";
import { listGallery } from "@/lib/db/queries";
import { galleryCategories } from "@/lib/site-config";
import { GalleryAddForm } from "@/components/admin/gallery-add-form";
import { deleteGalleryAction } from "./actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

export default async function GalleryPage() {
  const images = await listGallery();
  const categories = galleryCategories.filter((c) => c !== "All");

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink">Gallery</h1>
      <p className="mt-1 text-sm text-ink/55">
        Website ke photo gallery ke liye photos upload/remove karo.
      </p>

      <section className="mt-6 rounded-xl border border-gold/25 bg-cream-light p-5">
        <h2 className="mb-4 font-serif text-lg font-semibold text-emerald">
          Add a photo
        </h2>
        <GalleryAddForm categories={categories} />
      </section>

      <section className="mt-8">
        <h2 className="mb-4 font-serif text-lg font-semibold text-ink">
          All photos ({images.length})
        </h2>
        {images.length === 0 ? (
          <p className="rounded-xl border border-gold/25 bg-cream-light p-8 text-center text-sm text-ink/50">
            Abhi koi photo nahi hai.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img) => (
              <figure
                key={img.id}
                className="group relative overflow-hidden rounded-xl border border-gold/25 bg-cream-light"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="truncate text-xs text-ink/60" title={img.alt}>
                    {img.category}
                  </span>
                  <form action={deleteGalleryAction}>
                    <input type="hidden" name="id" value={img.id} />
                    <ConfirmButton
                      message="Delete this photo?"
                      className="rounded-md p-1.5 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </ConfirmButton>
                  </form>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
