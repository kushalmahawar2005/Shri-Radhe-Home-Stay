"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import {
  saveTestimonialsAction,
  type ContentState,
} from "@/app/admin/(panel)/content/actions";

type Testimonial = {
  quote: string;
  author: string;
  location: string;
  rating: number;
};

const field =
  "w-full rounded-lg border border-gold/40 bg-white px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald px-5 py-2.5 text-sm font-semibold text-cream-light transition hover:bg-emerald-dark disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Save reviews
    </button>
  );
}

export function TestimonialEditor({ initial }: { initial: Testimonial[] }) {
  const [state, formAction] = useFormState<ContentState, FormData>(
    saveTestimonialsAction,
    {}
  );
  const [items, setItems] = useState<Testimonial[]>(initial);

  function update(i: number, key: keyof Testimonial, value: string | number) {
    setItems((prev) =>
      prev.map((it, j) => (j === i ? { ...it, [key]: value } : it))
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="testimonials" value={JSON.stringify(items)} />

      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-gold/20 bg-cream p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <textarea
                value={item.quote}
                onChange={(e) => update(i, "quote", e.target.value)}
                placeholder="Review text"
                rows={2}
                className={field}
              />
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <input
                  value={item.author}
                  onChange={(e) => update(i, "author", e.target.value)}
                  placeholder="Name"
                  className={field}
                />
                <input
                  value={item.location}
                  onChange={(e) => update(i, "location", e.target.value)}
                  placeholder="Location / type"
                  className={field}
                />
                <select
                  value={item.rating}
                  onChange={(e) => update(i, "rating", Number(e.target.value))}
                  className={field}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
              className="mt-1 rounded-md p-1.5 text-red-600 hover:bg-red-50"
              aria-label="Remove review"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setItems([
            ...items,
            { quote: "", author: "", location: "", rating: 5 },
          ])
        }
        className="inline-flex w-fit items-center gap-1 rounded-lg border border-emerald/40 px-3 py-2 text-sm font-medium text-emerald hover:bg-emerald/10"
      >
        <Plus className="h-4 w-4" /> Add review
      </button>

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
