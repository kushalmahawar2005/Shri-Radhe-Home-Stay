"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Plus } from "lucide-react";
import {
  addGalleryAction,
  type GalleryState,
} from "@/app/admin/(panel)/gallery/actions";
import { ImageField } from "@/components/admin/uploader";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald px-4 text-sm font-semibold text-white transition hover:bg-emerald-dark disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      Add photo to website
    </button>
  );
}

export function GalleryAddForm({ categories }: { categories: string[] }) {
  const [state, formAction] = useFormState<GalleryState, FormData>(
    addGalleryAction,
    {}
  );
  const [src, setSrc] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setSrc("");
    }
  }, [state.ok]);

  const field =
    "w-full rounded-xl border border-gold/40 bg-white px-3 py-3 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:text-sm";

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="src" value={src} />
      <ImageField value={src} onChange={setSrc} label="Choose a photo" />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink/80">
          Photo description
          <input name="alt" className={`mt-1 ${field}`} placeholder="Deluxe AC room" />
        </label>
        <label className="text-sm font-medium text-ink/80">
          Show this photo in
          <select name="category" className={`mt-1 ${field}`}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div>
        <SubmitBtn />
      </div>
      {state.ok ? <p role="status" className="rounded-xl bg-emerald/10 px-3 py-2 text-sm font-medium text-emerald">Photo added to the website.</p> : null}
    </form>
  );
}
