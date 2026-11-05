"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { Check, Loader2, Minus, Plus, Save, Snowflake, Fan } from "lucide-react";
import { saveRoomAction, type RoomFormState } from "@/app/admin/(panel)/rooms/actions";
import { ImageField, GalleryField } from "@/components/admin/uploader";
import { ListInput } from "@/components/admin/list-input";
import { COMMON_AMENITIES } from "@/lib/site-config";

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
  name: "", slug: "", image: "", alt: "", blurb: "", guests: "",
  price: "On Request", priceNight: "", priceAmount: null, tagline: "",
  bed: "", size: "", features: [], amenities: [...COMMON_AMENITIES], highlights: [], gallery: [], published: true,
};

const field = "mt-1 w-full rounded-xl border border-gold/40 bg-white px-3 py-3 text-base text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:text-sm";

const BED_SUGGESTIONS = ["Double Bed", "2 Double Beds", "Double Bed + Single Bed", "Double Bed + Extra Bedding"];

/* Feature labels the form manages itself; everything else is kept as typed. */
const isAcLabel = (f: string) => /^(non[\s-]?)?ac$/i.test(f.trim());
const isGuestLabel = (f: string) => /guest|adult|child/i.test(f);
const isCoolingAmenity = (a: string) => a === "Air Conditioner" || a === "Ceiling Fan";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function parseCapacity(guests: string) {
  const adults = Number(/(\d+)\s*adult/i.exec(guests)?.[1] ?? /(\d+)/.exec(guests)?.[1] ?? 2);
  const children = Number(/(\d+)\s*child/i.exec(guests)?.[1] ?? 0);
  return { adults, children };
}

function guestsLabel(adults: number, children: number) {
  const a = `${adults} ${adults === 1 ? "Adult" : "Adults"}`;
  return children > 0 ? `${a} + ${children} ${children === 1 ? "Child" : "Children"}` : a;
}

function formatRupees(amount: number | null) {
  return amount ? `₹${amount.toLocaleString("en-IN")}` : "";
}

function initialPrice(data: RoomFormData) {
  if (data.priceAmount) return data.priceAmount;
  const n = Number(data.priceNight.replace(/[^0-9]/g, ""));
  return n > 0 ? n : null;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald px-5 text-sm font-semibold text-white transition hover:bg-emerald-dark disabled:opacity-60">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {pending ? "Saving…" : "Save room"}
    </button>
  );
}

function Stepper({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (n: number) => void }) {
  const btn = "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/40 bg-white text-ink transition hover:bg-cream disabled:opacity-40";
  return (
    <div>
      <span className="text-sm font-medium text-ink/80">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`}><Minus className="h-4 w-4" /></button>
        <span className="w-10 text-center text-lg font-semibold tabular-nums text-ink" aria-live="polite">{value}</span>
        <button type="button" className={btn} onClick={() => onChange(Math.min(12, value + 1))} aria-label={`More ${label.toLowerCase()}`}><Plus className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export function RoomForm({ initial }: { initial?: RoomFormData }) {
  const data = initial ?? empty;
  const [state, formAction] = useFormState<RoomFormState, FormData>(saveRoomAction, {});
  const [image, setImage] = useState(data.image);
  const [gallery, setGallery] = useState<string[]>(data.gallery);
  const [highlights, setHighlights] = useState<string[]>(data.highlights);
  const [slug, setSlug] = useState(data.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(data.slug));

  // Simple controls that generate the text the website shows.
  const [isAc, setIsAc] = useState(() => !data.features.some((f) => /non[\s-]?ac/i.test(f)) && (data.features.some(isAcLabel) || data.amenities.includes("Air Conditioner") || !initial));
  const [{ adults, children }, setCapacity] = useState(() => parseCapacity(data.guests));
  const [price, setPrice] = useState<number | null>(() => initialPrice(data));
  const [bed, setBed] = useState(data.bed);
  const [extraFeatures, setExtraFeatures] = useState<string[]>(() => data.features.filter((f) => !isAcLabel(f) && !isGuestLabel(f)));
  const [amenities, setAmenities] = useState<string[]>(() => data.amenities.filter((a) => !isCoolingAmenity(a)));

  const guests = guestsLabel(adults, children);
  const features = useMemo(
    () => [isAc ? "AC" : "Non-AC", ...extraFeatures, children > 0 ? guests : `${adults} Guests`],
    [isAc, extraFeatures, children, guests, adults],
  );
  const allAmenities = useMemo(() => [isAc ? "Air Conditioner" : "Ceiling Fan", ...amenities], [isAc, amenities]);
  const customAmenities = amenities.filter((a) => !(COMMON_AMENITIES as readonly string[]).includes(a));

  function toggleAmenity(a: string) {
    setAmenities((list) => (list.includes(a) ? list.filter((x) => x !== a) : [...list, a]));
  }

  const choice = (active: boolean) =>
    `flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${active ? "border-emerald bg-emerald text-white" : "border-gold/40 bg-white text-ink/75 hover:border-emerald/50"}`;

  return (
    <form action={formAction} className="flex flex-col gap-4 sm:gap-6">
      {data.id ? <input type="hidden" name="id" value={data.id} /> : null}
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
      <input type="hidden" name="features" value={JSON.stringify(features)} />
      <input type="hidden" name="amenities" value={JSON.stringify(allAmenities)} />
      <input type="hidden" name="highlights" value={JSON.stringify(highlights)} />
      <input type="hidden" name="guests" value={guests} />
      <input type="hidden" name="priceNight" value={formatRupees(price)} />
      <input type="hidden" name="priceAmount" value={price ?? ""} />
      <input type="hidden" name="bed" value={bed} />
      <input type="hidden" name="price" value={data.price || "On Request"} />

      {state.error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}

      {/* 1 ── Basics */}
      <section className="rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
        <h2 className="font-serif text-lg font-semibold text-emerald">1. Room details</h2>
        <p className="mb-4 mt-1 text-sm text-ink/55">Name, price and how many people can stay.</p>

        <label className="block text-sm font-medium text-ink/80">Room name
          <input name="name" required defaultValue={data.name} onChange={(event) => { if (!slugTouched) setSlug(slugify(event.target.value)); }} className={field} placeholder="e.g. Madhuvan" />
        </label>

        <div className="mt-4">
          <span className="text-sm font-medium text-ink/80">Room type</span>
          <div className="mt-1 flex gap-2" role="radiogroup" aria-label="Room type">
            <button type="button" role="radio" aria-checked={isAc} onClick={() => setIsAc(true)} className={choice(isAc)}><Snowflake className="h-4 w-4" />AC</button>
            <button type="button" role="radio" aria-checked={!isAc} onClick={() => setIsAc(false)} className={choice(!isAc)}><Fan className="h-4 w-4" />Non-AC</button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <label className="text-sm font-medium text-ink/80">Price per night (₹)
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 mt-0.5 -translate-y-1/2 text-ink/50">₹</span>
              <input type="number" inputMode="numeric" min="0" step="50" value={price ?? ""} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : null)} className={`${field} pl-7`} placeholder="4000" />
            </div>
          </label>
          <Stepper label="Adults" value={adults} min={1} onChange={(n) => setCapacity({ adults: n, children })} />
          <Stepper label="Children" value={children} min={0} onChange={(n) => setCapacity({ adults, children: n })} />
        </div>
        <p className="mt-2 text-sm text-ink/55">
          Website will show: <strong className="text-ink">{guests}</strong>{price ? <> · <strong className="text-ink">{formatRupees(price)}</strong> / night</> : null} · <strong className="text-ink">{isAc ? "AC" : "Non-AC"}</strong>
        </p>

        <label className="mt-4 block text-sm font-medium text-ink/80">Beds
          <input value={bed} onChange={(e) => setBed(e.target.value)} className={field} placeholder="e.g. 2 Double Beds" list="bed-suggestions" />
          <datalist id="bed-suggestions">{BED_SUGGESTIONS.map((b) => <option key={b} value={b} />)}</datalist>
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {BED_SUGGESTIONS.map((b) => (
            <button key={b} type="button" onClick={() => setBed(b)} className={`min-h-9 rounded-full border px-3 text-xs font-medium transition ${bed === b ? "border-emerald bg-emerald/10 text-emerald" : "border-gold/35 text-ink/65 hover:border-emerald/40"}`}>{b}</button>
          ))}
        </div>

        <label className="mt-4 block text-sm font-medium text-ink/80">Short description
          <textarea name="blurb" rows={3} defaultValue={data.blurb} className={field} placeholder="One or two lines about what makes this room nice." />
        </label>
        <label className="mt-4 flex min-h-11 items-center gap-3 text-sm font-medium text-ink/80">
          <input type="checkbox" name="published" defaultChecked={data.published} className="h-5 w-5 accent-emerald" />Show this room on the website
        </label>
      </section>

      {/* 2 ── Photos */}
      <section className="rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
        <h2 className="font-serif text-lg font-semibold text-emerald">2. Room photos</h2>
        <p className="mb-4 mt-1 text-sm text-ink/55">The main photo appears on the room card. Add more photos below — guests can swipe through them.</p>
        <ImageField value={image} onChange={setImage} label="Main room photo" />
        <div className="mt-5"><GalleryField value={gallery} onChange={setGallery} label="More room photos" /></div>
      </section>

      {/* 3 ── Facilities */}
      <section className="rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
        <h2 className="font-serif text-lg font-semibold text-emerald">3. What&apos;s included</h2>
        <p className="mb-4 mt-1 text-sm text-ink/55">Tick everything this room offers. {isAc ? "Air Conditioner" : "Ceiling Fan"} is added automatically from the room type.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {COMMON_AMENITIES.map((a) => {
            const on = amenities.includes(a);
            return (
              <button key={a} type="button" role="checkbox" aria-checked={on} onClick={() => toggleAmenity(a)} className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 text-left text-sm transition ${on ? "border-emerald/60 bg-emerald/5 text-ink" : "border-gold/30 bg-white text-ink/60"}`}>
                <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${on ? "border-emerald bg-emerald text-white" : "border-gold/50 bg-white"}`}>{on ? <Check className="h-3.5 w-3.5" /> : null}</span>
                {a}
              </button>
            );
          })}
        </div>
        <div className="mt-4">
          <ListInput value={customAmenities} onChange={(list) => setAmenities([...amenities.filter((a) => (COMMON_AMENITIES as readonly string[]).includes(a)), ...list])} label="Anything else? (optional)" placeholder="e.g. LED TV" />
        </div>
      </section>

      <details className="rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
        <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-emerald">More settings <span className="ml-2 text-xs font-normal text-ink/50">(optional — usually not needed)</span></summary>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-ink/80">Room page link
            <input name="slug" required value={slug} onChange={(event) => { setSlugTouched(true); setSlug(slugify(event.target.value)); }} className={field} placeholder="madhuvan" />
            <span className="mt-1 block text-xs font-normal text-ink/50">shreeradhehomestay.in/rooms/{slug || "…"}</span>
          </label>
          <label className="text-sm font-medium text-ink/80">Room size
            <input name="size" defaultValue={data.size} className={field} placeholder="e.g. 180 sq. ft." />
          </label>
          <label className="text-sm font-medium text-ink/80 sm:col-span-2">Tagline (shown under the room name)
            <input name="tagline" defaultValue={data.tagline} className={field} placeholder="e.g. Bright Room for Four" />
          </label>
          <label className="text-sm font-medium text-ink/80 sm:col-span-2">Main photo description (for Google & screen readers)
            <input name="alt" defaultValue={data.alt} className={field} placeholder="e.g. Room with two double beds and sunflower decor" />
          </label>
        </div>
        <div className="mt-5 grid gap-5">
          <ListInput value={extraFeatures} onChange={setExtraFeatures} label="Extra labels on the room card" placeholder="e.g. Attached Bath + Geyser" />
          <ListInput value={highlights} onChange={setHighlights} label="Room highlights" placeholder="e.g. Sleeps 4 Adults" />
        </div>
      </details>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-col gap-2 border-t border-gold/25 bg-cream/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:flex-row sm:items-center sm:border-0 sm:bg-transparent sm:p-0">
        <SaveButton />
        <Link href="/admin/rooms" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gold/40 px-5 text-sm font-medium text-ink/70 hover:bg-cream">Cancel</Link>
      </div>
    </form>
  );
}
