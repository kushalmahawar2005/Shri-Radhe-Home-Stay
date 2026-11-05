"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { saveFaqsAction, type ContentState } from "@/app/admin/(panel)/content/actions";

type Faq = { q: string; a: string };
const field = "w-full rounded-xl border border-gold/40 bg-white px-3 py-3 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:text-sm";

function SaveButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald px-5 text-sm font-semibold text-white disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{pending ? "Saving…" : "Save FAQs"}</button>;
}

export function FaqEditor({ initial }: { initial: Faq[] }) {
  const [state, formAction] = useFormState<ContentState, FormData>(saveFaqsAction, {});
  const [items, setItems] = useState<Faq[]>(initial);
  function update(index: number, key: keyof Faq, value: string) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="faqs" value={JSON.stringify(items)} />
      {items.length === 0 ? <p className="rounded-xl bg-cream-light p-4 text-sm text-ink/60">No FAQs added yet. Add a question guests often ask.</p> : null}
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-gold/20 bg-cream-light p-3 sm:p-4">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <input value={item.q} onChange={(event) => update(index, "q", event.target.value)} placeholder="Question" aria-label={`Question ${index + 1}`} className={`${field} font-medium`} />
              <textarea value={item.a} onChange={(event) => update(index, "a", event.target.value)} placeholder="Answer" aria-label={`Answer ${index + 1}`} rows={3} className={field} />
            </div>
            <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-red-700 hover:bg-red-50" aria-label="Remove FAQ"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => setItems((current) => [...current, { q: "", a: "" }])} className="inline-flex min-h-11 w-fit items-center gap-1 rounded-lg border border-emerald/40 px-3 text-sm font-medium text-emerald hover:bg-emerald/10"><Plus className="h-4 w-4" />Add a question</button>
      {state.error ? <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? <p role="status" className="rounded-lg bg-emerald/10 px-4 py-3 text-sm text-emerald">FAQs saved. Your website is updated.</p> : null}
      <SaveButton />
    </form>
  );
}
