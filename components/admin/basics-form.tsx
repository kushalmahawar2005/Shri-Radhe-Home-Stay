"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { saveBasicsAction, type ContentState } from "@/app/admin/(panel)/content/actions";

export type BasicsData = {
  brand: {
    name?: string; shortName?: string; tagline?: string; description?: string;
    intro?: string; templeWalkTime?: string; logo?: string | null;
  };
  contact: {
    phones?: { primary?: string; secondary?: string };
    address?: { street?: string; city?: string; state?: string; postalCode?: string; country?: string; full?: string; lat?: number | null; lng?: number | null };
    links?: { instagram?: string; instagramHandle?: string; facebook?: string; mapsEmbed?: string; mapsDirections?: string };
  };
};

const field = "mt-1 w-full rounded-xl border border-gold/40 bg-white px-3 py-3 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:text-sm";

function Input({ label, name, value = "", type = "text", placeholder }: { label: string; name: string; value?: string | number | null; type?: string; placeholder?: string }) {
  return <label className="block text-sm font-medium text-ink/80">{label}<input name={name} type={type} defaultValue={value ?? ""} placeholder={placeholder} className={field} /></label>;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald px-5 text-sm font-semibold text-white disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{pending ? "Saving…" : "Save business details"}</button>;
}

export function BasicsForm({ data }: { data: BasicsData }) {
  const [state, formAction] = useFormState<ContentState, FormData>(saveBasicsAction, {});
  const { brand, contact } = data;
  const address = contact.address ?? {};
  const links = contact.links ?? {};
  const phones = contact.phones ?? {};

  return (
    <form action={formAction} className="space-y-4">
      <section className="rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
        <h2 className="font-serif text-lg font-semibold text-emerald">Phone & address</h2>
        <p className="mb-4 mt-1 text-sm text-ink/55">These details appear on your website and booking buttons.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Main phone number *" name="phonePrimary" value={phones.primary} placeholder="8619301401" />
          <Input label="Second phone number (optional)" name="phoneSecondary" value={phones.secondary} placeholder="9799496789" />
          <Input label="Street / area" name="street" value={address.street} />
          <Input label="City" name="city" value={address.city} />
          <Input label="State" name="state" value={address.state} />
          <Input label="PIN code" name="postalCode" value={address.postalCode} />
        </div>
        <label className="mt-4 block text-sm font-medium text-ink/80">Full address
          <input name="fullAddress" defaultValue={address.full ?? ""} className={field} />
        </label>
        <input type="hidden" name="country" value={address.country ?? "IN"} />
      </section>

      <details className="rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
        <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-emerald">More website details <span className="ml-2 text-xs font-normal text-ink/50">(optional)</span></summary>
        <div className="mt-4 space-y-5">
          <section>
            <h3 className="mb-3 font-semibold text-ink">Business information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Business name" name="name" value={brand.name} />
              <Input label="Short name" name="shortName" value={brand.shortName} />
              <Input label="Tagline" name="tagline" value={brand.tagline} />
              <Input label="Walk time to temple" name="templeWalkTime" value={brand.templeWalkTime} />
              <Input label="Logo file path" name="logo" value={brand.logo ?? ""} placeholder="/logo-brand.webp" />
            </div>
            <label className="mt-4 block text-sm font-medium text-ink/80">Short description
              <textarea name="description" rows={2} defaultValue={brand.description ?? ""} className={field} />
            </label>
            <label className="mt-4 block text-sm font-medium text-ink/80">Welcome message
              <textarea name="intro" rows={2} defaultValue={brand.intro ?? ""} className={field} />
            </label>
          </section>
          <section>
            <h3 className="mb-3 font-semibold text-ink">Social media & map links</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Instagram link" name="instagram" value={links.instagram} />
              <Input label="Instagram username" name="instagramHandle" value={links.instagramHandle} />
              <Input label="Facebook link" name="facebook" value={links.facebook} />
              <Input label="Google Maps directions link" name="mapsDirections" value={links.mapsDirections} />
            </div>
            <label className="mt-4 block text-sm font-medium text-ink/80">Google Maps embed link
              <input name="mapsEmbed" defaultValue={links.mapsEmbed ?? ""} className={field} />
            </label>
          </section>
          <section>
            <h3 className="mb-3 font-semibold text-ink">Map location (optional)</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Latitude" name="lat" type="number" value={address.lat} />
              <Input label="Longitude" name="lng" type="number" value={address.lng} />
            </div>
          </section>
        </div>
      </details>

      {state.error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? <p role="status" className="rounded-xl bg-emerald/10 px-4 py-3 text-sm font-medium text-emerald">Saved. Your website details are updated.</p> : null}
      <SaveButton />
    </form>
  );
}
