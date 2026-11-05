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
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  invert?: boolean;
  /** Use `as="h1"` when this heading is the page's main title. */
  as?: "h1" | "h2";
}) {
  const titleParts = highlight
    ? title.split(new RegExp(`(${highlight})`, "i"))
    : [title];

  return (
    <Reveal
      className={cn(
        "flex flex-col gap-2 sm:gap-3",
        align === "center"
          ? "items-center text-center"
          : "items-center text-center lg:items-start lg:text-left",
        className
      )}
    >
      {eyebrow ? (
        <Eyebrow className={cn("hidden sm:inline-flex", invert && "text-gold-light")}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Flourish className={cn("hidden sm:block", align === "left" && "lg:ml-0")} />
      <Heading
        className={cn(
          "font-serif text-2xl font-bold leading-tight sm:text-4xl md:text-[2.6rem]",
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
      </Heading>
      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-sm leading-5 sm:text-base sm:leading-relaxed",
            invert ? "text-cream/80" : "text-ink/70"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
