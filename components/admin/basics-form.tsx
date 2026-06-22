"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import {
  saveBasicsAction,
  type ContentState,
} from "@/app/admin/(panel)/content/actions";

export type BasicsData = {
  brand: {
    name?: string;
    shortName?: string;
    tagline?: string;
    description?: string;
    intro?: string;
    templeWalkTime?: string;
    logo?: string | null;
  };
  contact: {
    phones?: { primary?: string; secondary?: string };
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      full?: string;
      lat?: number | null;
      lng?: number | null;
    };
    links?: {
      instagram?: string;
      instagramHandle?: string;
      facebook?: string;
      mapsEmbed?: string;
      mapsDirections?: string;
    };
  };
};

const field =
  "w-full rounded-lg border border-gold/40 bg-white px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

function Label({
  children,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  children: React.ReactNode;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="text-sm font-medium text-ink/80">
      {children}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={`mt-1 ${field}`}
      />
    </label>
  );
}

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald px-5 py-2.5 text-sm font-semibold text-cream-light transition hover:bg-emerald-dark disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Save changes
    </button>
  );
}

export function BasicsForm({ data }: { data: BasicsData }) {
  const [state, formAction] = useFormState<ContentState, FormData>(
    saveBasicsAction,
    {}
  );
  const { brand, contact } = data;
  const a = contact.address ?? {};
  const l = contact.links ?? {};
  const p = contact.phones ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <section className="rounded-xl border border-gold/25 bg-cream-light p-5">
        <h2 className="mb-4 font-serif text-lg font-semibold text-emerald">
          Business basics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label name="name" defaultValue={brand.name}>Business name</Label>
          <Label name="shortName" defaultValue={brand.shortName}>Short name</Label>
          <Label name="tagline" defaultValue={brand.tagline}>Tagline</Label>
          <Label name="templeWalkTime" defaultValue={brand.templeWalkTime}>
            Temple walk time
          </Label>
          <Label name="logo" defaultValue={brand.logo ?? ""}>Logo path (e.g. /logo.jpg)</Label>
        </div>
        <label className="mt-4 block text-sm font-medium text-ink/80">
          Short description (SEO / hero)
          <textarea
            name="description"
            rows={2}
            defaultValue={brand.description ?? ""}
            className={`mt-1 ${field}`}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-ink/80">
          Intro line
          <textarea
            name="intro"
            rows={2}
            defaultValue={brand.intro ?? ""}
            className={`mt-1 ${field}`}
          />
        </label>
      </section>

      <section className="rounded-xl border border-gold/25 bg-cream-light p-5">
        <h2 className="mb-4 font-serif text-lg font-semibold text-emerald">
          Phone & address
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label name="phonePrimary" defaultValue={p.primary} placeholder="8619301401">
            Primary phone
          </Label>
          <Label name="phoneSecondary" defaultValue={p.secondary} placeholder="9799496789">
            Secondary phone
          </Label>
          <Label name="street" defaultValue={a.street}>Street</Label>
          <Label name="city" defaultValue={a.city}>City</Label>
          <Label name="state" defaultValue={a.state}>State</Label>
          <Label name="postalCode" defaultValue={a.postalCode}>Postal code</Label>
          <Label name="lat" type="number" defaultValue={a.lat ?? ""}>Latitude</Label>
          <Label name="lng" type="number" defaultValue={a.lng ?? ""}>Longitude</Label>
        </div>
        <label className="mt-4 block text-sm font-medium text-ink/80">
          Full address (one line)
          <input name="fullAddress" defaultValue={a.full ?? ""} className={`mt-1 ${field}`} />
        </label>
        <input type="hidden" name="country" value={a.country ?? "IN"} />
      </section>

      <section className="rounded-xl border border-gold/25 bg-cream-light p-5">
        <h2 className="mb-4 font-serif text-lg font-semibold text-emerald">
          Social & map links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label name="instagram" defaultValue={l.instagram}>Instagram URL</Label>
          <Label name="instagramHandle" defaultValue={l.instagramHandle}>
            Instagram handle
          </Label>
          <Label name="facebook" defaultValue={l.facebook}>Facebook URL</Label>
        </div>
        <label className="mt-4 block text-sm font-medium text-ink/80">
          Google Maps embed URL
          <input name="mapsEmbed" defaultValue={l.mapsEmbed ?? ""} className={`mt-1 ${field}`} />
        </label>
        <label className="mt-4 block text-sm font-medium text-ink/80">
          Google Maps directions URL
          <input
            name="mapsDirections"
            defaultValue={l.mapsDirections ?? ""}
            className={`mt-1 ${field}`}
          />
        </label>
      </section>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-lg bg-emerald/10 px-4 py-2.5 text-sm text-emerald">
          Save ho gaya ✓
        </p>
      ) : null}

      <div>
        <SaveBtn />
      </div>
    </form>
  );
}
