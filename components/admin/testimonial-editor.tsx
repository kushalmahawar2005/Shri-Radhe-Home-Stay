"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { saveTestimonialsAction, type ContentState } from "@/app/admin/(panel)/content/actions";

type Testimonial = { quote: string; author: string; location: string; rating: number };
const field = "w-full rounded-xl border border-gold/40 bg-white px-3 py-3 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:text-sm";

function SaveButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald px-5 text-sm font-semibold text-white disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{pending ? "Saving…" : "Save reviews"}</button>;
}

export function TestimonialEditor({ initial }: { initial: Testimonial[] }) {
  const [state, formAction] = useFormState<ContentState, FormData>(saveTestimonialsAction, {});
  const [items, setItems] = useState<Testimonial[]>(initial);
  function update(index: number, key: keyof Testimonial, value: string | number) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="testimonials" value={JSON.stringify(items)} />
      {items.length === 0 ? <p className="rounded-xl bg-cream-light p-4 text-sm text-ink/60">No guest reviews added yet.</p> : null}
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-gold/20 bg-cream-light p-3 sm:p-4">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <textarea value={item.quote} onChange={(event) => update(index, "quote", event.target.value)} placeholder="Guest review" aria-label={`Review ${index + 1}`} rows={3} className={field} />
              <div className="grid gap-2 sm:grid-cols-3">
                <input value={item.author} onChange={(event) => update(index, "author", event.target.value)} placeholder="Guest name" aria-label={`Guest name ${index + 1}`} className={field} />
                <input value={item.location} onChange={(event) => update(index, "location", event.target.value)} placeholder="Location" aria-label={`Location ${index + 1}`} className={field} />
                <select value={item.rating} onChange={(event) => update(index, "rating", Number(event.target.value))} aria-label={`Rating ${index + 1}`} className={field}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select>
              </div>
            </div>
            <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-red-700 hover:bg-red-50" aria-label="Remove review"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => setItems((current) => [...current, { quote: "", author: "", location: "", rating: 5 }])} className="inline-flex min-h-11 w-fit items-center gap-1 rounded-lg border border-emerald/40 px-3 text-sm font-medium text-emerald hover:bg-emerald/10"><Plus className="h-4 w-4" />Add a review</button>
      {state.error ? <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? <p role="status" className="rounded-lg bg-emerald/10 px-4 py-3 text-sm text-emerald">Reviews saved. Your website is updated.</p> : null}
      <SaveButton />
    </form>
  );
}
