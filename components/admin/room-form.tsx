"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { saveRoomAction, type RoomFormState } from "@/app/admin/(panel)/rooms/actions";
import { ImageField, GalleryField } from "@/components/admin/uploader";
import { ListInput } from "@/components/admin/list-input";

export type RoomFormData = {
  id?: number;
  name: string;
  slug: string;
  image: string;
  alt: string;
  blurb: string;
  guests: string;
  price: string;
  priceNight: string;
  priceAmount: number | null;
  tagline: string;
  bed: string;
  size: string;
  features: string[];
  amenities: string[];
  highlights: string[];
  gallery: string[];
  published: boolean;
};

const empty: RoomFormData = {
  name: "",
  slug: "",
  image: "",
  alt: "",
  blurb: "",
  guests: "",
  price: "On Request",
  priceNight: "",
  priceAmount: null,
  tagline: "",
  bed: "",
  size: "",
  features: [],
  amenities: [],
  highlights: [],
  gallery: [],
  published: true,
};

const field =
  "w-full rounded-lg border border-gold/40 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald px-5 py-2.5 text-sm font-semibold text-cream-light transition hover:bg-emerald-dark disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Save Room
    </button>
  );
}

export function RoomForm({ initial }: { initial?: RoomFormData }) {
  const data = initial ?? empty;
  const [state, formAction] = useFormState<RoomFormState, FormData>(
    saveRoomAction,
    {}
  );

  const [image, setImage] = useState(data.image);
  const [gallery, setGallery] = useState<string[]>(data.gallery);
  const [features, setFeatures] = useState<string[]>(data.features);
  const [amenities, setAmenities] = useState<string[]>(data.amenities);
  const [highlights, setHighlights] = useState<string[]>(data.highlights);
  const [slug, setSlug] = useState(data.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(data.slug));

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {data.id ? <input type="hidden" name="id" value={data.id} /> : null}
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
      <input type="hidden" name="features" value={JSON.stringify(features)} />
      <input type="hidden" name="amenities" value={JSON.stringify(amenities)} />
      <input type="hidden" name="highlights" value={JSON.stringify(highlights)} />

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <section className="rounded-xl border border-gold/25 bg-cream-light p-5">
        <h2 className="mb-4 font-serif text-lg font-semibold text-emerald">
          Basic details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-ink/80">
            Room name
            <input
              name="name"
              required
              defaultValue={data.name}
              onChange={(e) => {
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              className={`mt-1 ${field}`}
              placeholder="Deluxe Room"
            />
          </label>
          <label className="text-sm font-medium text-ink/80">
            Slug (URL)
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className={`mt-1 ${field}`}
              placeholder="deluxe"
            />
          </label>
          <label className="text-sm font-medium text-ink/80">
            Price / night (label)
            <input
              name="priceNight"
              defaultValue={data.priceNight}
              className={`mt-1 ${field}`}
              placeholder="₹1,500"
            />
          </label>
          <label className="text-sm font-medium text-ink/80">
            Price amount (number, for calc)
            <input
              name="priceAmount"
              type="number"
              min="0"
              defaultValue={data.priceAmount ?? ""}
              className={`mt-1 ${field}`}
              placeholder="1500"
            />
          </label>
          <label className="text-sm font-medium text-ink/80">
            Guests
            <input
              name="guests"
              defaultValue={data.guests}
              className={`mt-1 ${field}`}
              placeholder="2 Guests"
            />
          </label>
          <label className="text-sm font-medium text-ink/80">
            Bed
            <input
              name="bed"
              defaultValue={data.bed}
              className={`mt-1 ${field}`}
              placeholder="King Size Bed"
            />
          </label>
          <label className="text-sm font-medium text-ink/80">
            Size
            <input
              name="size"
              defaultValue={data.size}
              className={`mt-1 ${field}`}
              placeholder="180 sq.ft"
            />
          </label>
          <label className="text-sm font-medium text-ink/80">
            Tagline
            <input
              name="tagline"
              defaultValue={data.tagline}
              className={`mt-1 ${field}`}
              placeholder="Comfort, Peace & Devotion"
            />
          </label>
        </div>

        <label className="mt-4 block text-sm font-medium text-ink/80">
          Short description (blurb)
          <textarea
            name="blurb"
            rows={3}
            defaultValue={data.blurb}
            className={`mt-1 ${field}`}
            placeholder="A cosy, well-appointed AC room…"
          />
        </label>

        <label className="mt-4 flex items-center gap-2 text-sm font-medium text-ink/80">
          <input
            type="checkbox"
            name="published"
            defaultChecked={data.published}
            className="h-4 w-4 accent-emerald"
          />
          Published (show on website)
        </label>
      </section>

      <section className="rounded-xl border border-gold/25 bg-cream-light p-5">
        <h2 className="mb-4 font-serif text-lg font-semibold text-emerald">
          Photos
        </h2>
        <ImageField value={image} onChange={setImage} label="Main image (card / hero)" />
        <label className="mt-4 block text-sm font-medium text-ink/80">
          Main image alt text (for SEO/accessibility)
          <input
            name="alt"
            defaultValue={data.alt}
            className={`mt-1 ${field}`}
            placeholder="Deluxe AC room at Shri Radha Home Stay"
          />
        </label>
        <div className="mt-4">
          <GalleryField value={gallery} onChange={setGallery} />
        </div>
      </section>

      <section className="rounded-xl border border-gold/25 bg-cream-light p-5">
        <h2 className="mb-4 font-serif text-lg font-semibold text-emerald">
          Features & amenities
        </h2>
        <div className="grid gap-5">
          <ListInput
            value={features}
            onChange={setFeatures}
            label="Feature tags (shown on cards)"
            placeholder="AC, Free WiFi…"
          />
          <ListInput
            value={amenities}
            onChange={setAmenities}
            label="Room amenities (detail page list)"
            placeholder="Air Conditioner…"
          />
          <ListInput
            value={highlights}
            onChange={setHighlights}
            label="Room highlights"
            placeholder="Temple Town View…"
          />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <SaveButton />
        <Link
          href="/admin/rooms"
          className="rounded-lg border border-gold/40 px-5 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-cream"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
