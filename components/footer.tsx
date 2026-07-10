import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getBrand, getContact, getRooms } from "@/lib/content-store";
import { Logo } from "@/components/logo";
import { Lotus } from "@/components/decor";

export async function Footer() {
  const [brand, contact, rooms] = await Promise.all([
    getBrand(),
    getContact(),
    getRooms(),
  ]);
  const { address, phones, links } = contact;
  const { nav } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-emerald-dark text-cream/80">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* brand */}
        <div>
          <Logo
            invert
            name={brand.name}
            shortName={brand.shortName}
            logo={brand.logo}
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            {brand.tagline}. A peaceful homestay near Shrinathji Temple,
            Nathdwara.
          </p>
          <Lotus className="mt-5 h-7 w-12 text-gold-light" />
        </div>

        {/* quick links */}
        <nav aria-label="Quick links">
          <h3 className="font-serif text-lg font-semibold text-cream-light">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-gold-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* rooms */}
        <nav aria-label="Our rooms">
          <h3 className="font-serif text-lg font-semibold text-cream-light">
            Our Rooms
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {rooms.map((room) => (
              <li key={room.slug}>
                <Link
                  href="/rooms"
                  className="transition-colors hover:text-gold-light"
                >
                  {room.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* contact + social */}
        <div>
          <h3 className="font-serif text-lg font-semibold text-cream-light">
            Contact Us
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <span>{address.full}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-gold-light" />
              <a href={phones.telPrimary} className="hover:text-gold-light">
                {phones.primary}
              </a>
              <span aria-hidden="true">·</span>
              <a href={phones.telSecondary} className="hover:text-gold-light">
                {phones.secondary}
              </a>
            </li>
          </ul>

          <h3 className="mt-5 font-serif text-base font-semibold text-cream-light">
            Follow Us
          </h3>
          <div className="mt-3 flex gap-3">
            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 transition-colors hover:bg-gold hover:text-emerald-dark"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 transition-colors hover:bg-gold hover:text-emerald-dark"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={links.whatsappPrimary}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 transition-colors hover:bg-gold hover:text-emerald-dark"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/60 sm:flex-row">
          <p>
            © {year} {brand.name}. All rights reserved.
          </p>
          <p>
            Made with devotion in Nathdwara · {links.instagramHandle}
          </p>
        </div>
      </div>
    </footer>
  );
}
