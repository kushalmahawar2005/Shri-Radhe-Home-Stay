"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle, CalendarCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        "sticky top-0 z-50 w-full bg-cream/90 backdrop-blur transition-shadow duration-300",
        scrolled ? "shadow-nav" : "shadow-none"
      )}
    >
      <nav
        className="container flex h-[72px] items-center justify-between gap-4"
        aria-label="Primary"
      >
        <Link href="/#home" aria-label={`${siteConfig.name} — home`}>
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-medium text-ink/80 transition-colors hover:text-emerald"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="outline" size="sm">
            <a href={siteConfig.links.whatsappPrimary} target="_blank" rel="noopener noreferrer">
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
              className="rounded-lg px-3 py-3 text-base font-medium text-ink/90 hover:bg-gold/10 hover:text-emerald"
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
