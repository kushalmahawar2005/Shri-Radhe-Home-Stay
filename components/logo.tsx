import Image from "next/image";
import { FeatherMark } from "@/components/decor";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/** Serif wordmark + logo mark. `invert` for dark backgrounds (footer). */
export function Logo({ invert = false }: { invert?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {siteConfig.logo ? (
        <Image
          src={siteConfig.logo}
          alt={`${siteConfig.name} logo`}
          width={44}
          height={44}
          priority
          className="h-11 w-11 object-contain"
        />
      ) : (
        <FeatherMark
          className={cn("h-9 w-9", invert ? "text-gold-light" : "text-gold")}
        />
      )}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-2xl font-bold tracking-wide",
            invert ? "text-cream-light" : "text-emerald"
          )}
        >
          {siteConfig.shortName}
        </span>
        <span
          className={cn(
            "text-[0.6rem] font-semibold uppercase tracking-[0.32em]",
            invert ? "text-gold-light" : "text-gold-dark"
          )}
        >
          Home Stay
        </span>
      </span>
    </span>
  );
}
