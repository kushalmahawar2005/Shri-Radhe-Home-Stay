import { Eyebrow, Flourish } from "@/components/decor";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

/**
 * Shared section header: eyebrow label + gold flourish divider + serif title.
 * `highlight` renders that word in emerald green (matches reference).
 */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
  className,
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  invert?: boolean;
}) {
  const titleParts = highlight
    ? title.split(new RegExp(`(${highlight})`, "i"))
    : [title];

  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3",
        align === "center"
          ? "items-center text-center"
          : "items-center text-center lg:items-start lg:text-left",
        className
      )}
    >
      {eyebrow ? (
        <Eyebrow className={invert ? "text-gold-light" : undefined}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Flourish className={align === "left" ? "lg:ml-0" : undefined} />
      <h2
        className={cn(
          "font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-[2.6rem]",
          invert ? "text-cream-light" : "text-ink"
        )}
      >
        {titleParts.map((part, i) =>
          highlight && part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className={invert ? "text-gold-light" : "text-emerald"}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed",
            invert ? "text-cream/80" : "text-ink/70"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
