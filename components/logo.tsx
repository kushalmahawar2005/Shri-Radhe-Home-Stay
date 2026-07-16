import Image from "next/image";
import { FeatherMark } from "@/components/decor";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/** Serif wordmark + logo mark. `invert` for dark backgrounds (footer). */
export function Logo({
  invert = false,
  name,
  shortName,
  logo,
}: {
  invert?: boolean;
  name?: string;
  shortName?: string;
  logo?: string | null;
}) {
  const _name = name ?? siteConfig.name;
  const _shortName = shortName ?? siteConfig.shortName;
  const _logo = logo !== undefined ? logo : siteConfig.logo;
  return (
    <span className="inline-flex items-center gap-2.5">
      {_logo ? (
        <Image
          src={_logo}
          alt={`${_name} logo`}
          width={80}
          height={80}
          priority
          className="-ml-2 mt-0 h-14 w-14 object-contain md:-mt-1 md:h-16 md:w-16"
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
          {_shortName}
        </span>
        <span
          className={cn(
            "text-[0.7rem] font-semibold uppercase tracking-[0.32em]",
            invert ? "text-gold-light" : "text-gold-dark"
          )}
        >
          Villa Stay
        </span>
      </span>
    </span>
  );
}
