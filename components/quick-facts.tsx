import { siteConfig } from "@/lib/site-config";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";

export function QuickFacts() {
  return (
    <section aria-label="Quick facts" className="relative z-20 bg-cream">
      <div className="container relative z-20 -mt-8 pb-8">
        <Reveal>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-5 rounded-2xl border border-gold/40 bg-cream-light px-4 py-6 shadow-card sm:grid-cols-3 md:px-8 lg:grid-cols-6 lg:divide-x lg:divide-gold/20">
            {siteConfig.quickFacts.map((fact) => (
              <li
                key={fact.label}
                className="flex flex-col items-center gap-2 px-2 text-center lg:px-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald/10">
                  <Icon name={fact.icon} className="h-5 w-5 text-emerald" />
                </span>
                <span className="text-sm font-medium leading-tight text-ink/80">
                  {fact.label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
