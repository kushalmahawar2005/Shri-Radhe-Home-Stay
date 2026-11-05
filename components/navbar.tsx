"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle, CalendarCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

type NavBrand = { name: string; shortName: string; logo: string | null };

export function Navbar({
  brand,
  whatsappPrimary,
}: {
  brand: NavBrand;
  whatsappPrimary: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => {
    const path = href.split("#")[0].replace(/\/$/, "") || "/";
    const current = pathname.replace(/\/$/, "") || "/";
    return path === "/" ? current === "/" : current.startsWith(path);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-gold/25 bg-cream/95 shadow-nav"
          : "border-transparent bg-cream/80"
      )}
    >
      <nav
        className="container flex h-[72px] items-center justify-between gap-4"
        aria-label="Primary"
      >
        <Link href="/#home" aria-label={`${brand.name} — home`}>
          <Logo name={brand.name} shortName={brand.shortName} logo={brand.logo} />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative py-1 text-[0.95rem] font-medium transition-colors hover:text-emerald",
                  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-gold after:transition-transform after:duration-300",
                  isActive(item.href)
                    ? "text-emerald after:scale-x-100"
                    : "text-ink/75 after:scale-x-0 hover:after:scale-x-100"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="outline" size="sm">
            <a href={whatsappPrimary} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/booking">
              <CalendarCheck className="h-4 w-4" />
              Book Now
            </Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-emerald lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="container flex flex-col gap-1 border-t border-gold/30 bg-cream pb-6 pt-2">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-3 text-base font-medium hover:bg-gold/10 hover:text-emerald",
                isActive(item.href) ? "bg-gold/10 text-emerald" : "text-ink/90"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild variant="primary" className="mt-3">
            <Link href="/booking" onClick={() => setOpen(false)}>
              <CalendarCheck className="h-4 w-4" />
              Book Now
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
