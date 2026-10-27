import type { Metadata } from "next";
import { Lotus } from "@/components/decor";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — Coming Soon` },
  robots: { index: false, follow: false },
};

export default function UnderDevelopment() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream-gradient px-6 text-center">
      <Lotus className="h-12 w-20 text-gold" />
      <h1 className="mt-4 font-serif text-4xl font-bold text-emerald sm:text-5xl">
        {siteConfig.name}
      </h1>
      <p className="mt-3 font-serif text-2xl text-ink">
        Our website is under development
      </p>
      <p className="mt-2 max-w-md text-ink/70">
        We&apos;re putting the finishing touches on our new site. For bookings
        near Shrinathji Temple, Nathdwara, please call or WhatsApp us.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={siteConfig.phones.telPrimary}
          className="rounded-full bg-emerald px-6 py-3 font-medium text-white"
        >
          Call {siteConfig.phones.primary}
        </a>
        <a
          href={siteConfig.links.whatsappPrimary}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-emerald px-6 py-3 font-medium text-emerald"
        >
          WhatsApp
        </a>
      </div>
    </main>
  );
}
