import { Plus } from "lucide-react";
import type { Faq } from "@/lib/content-store";

/**
 * Native <details> accordion — no JS, so the answers are in the HTML and
 * crawlable. Pair it with `faqSchema()` on the page for the FAQ rich result.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3">
      {faqs.map((faq) => (
        <details
          key={faq.q}
          className="group rounded-2xl border border-gold/30 bg-cream-light p-5 shadow-soft [&_summary]:list-none"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg font-semibold text-ink">
            <h3 className="font-serif text-lg font-semibold">{faq.q}</h3>
            <Plus className="h-5 w-5 shrink-0 text-emerald transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className="mt-3 leading-relaxed text-ink/70">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
