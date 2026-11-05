import { Trash2, Images } from "lucide-react";
import { listGallery } from "@/lib/db/queries";
import { galleryCategories } from "@/lib/site-config";
import { GalleryAddForm } from "@/components/admin/gallery-add-form";
import { deleteGalleryAction } from "./actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

export default async function GalleryPage() {
  const images = await listGallery();
  const categories = galleryCategories.filter((category) => category !== "All");

  return (
    <div>
      <p className="text-sm font-semibold text-emerald">Your website photos</p>
      <h1 className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">Photos</h1>
      <p className="mt-1 text-sm text-ink/55">Add or remove the photos guests see on your website.</p>

      <section className="mt-5 rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
        <h2 className="mb-4 font-serif text-lg font-semibold text-emerald">Add a photo</h2>
        <GalleryAddForm categories={categories} />
      </section>

      <section className="mt-7">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-semibold text-ink">Website photos</h2>
          <span className="rounded-full bg-cream-light px-3 py-1 text-sm text-ink/65">{images.length} total</span>
        </div>
        {images.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-gold/25 bg-cream-light p-8 text-center">
            <Images className="mx-auto h-9 w-9 text-emerald/60" />
            <p className="mt-3 font-semibold text-ink">No photos added yet</p>
            <p className="mt-1 text-sm text-ink/55">Upload a photo above to get started.</p>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {images.map((image) => (
              <figure key={image.id} className="overflow-hidden rounded-2xl border border-gold/25 bg-cream-light">
                <div className="aspect-[4/3] overflow-hidden bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.src} alt={image.alt || image.category} className="h-full w-full object-cover" />
                </div>
                <figcaption className="flex min-h-14 items-center justify-between gap-2 p-2.5">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink/75">{image.category}</span>
                    {image.alt ? <span className="block truncate text-xs text-ink/45">{image.alt}</span> : null}
                  </span>
                  <form action={deleteGalleryAction}>
                    <input type="hidden" name="id" value={image.id} />
                    <ConfirmButton message="Remove this photo from the website?" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-700 hover:bg-red-50" ariaLabel="Remove photo">
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
