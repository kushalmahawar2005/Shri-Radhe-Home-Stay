import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { Toran } from "@/components/decor";
import { BLUR_DATA_URL } from "@/lib/utils";

export function CtaBand() {
  const { phones, links } = siteConfig;
  return (
    <section
      aria-label="Book your stay"
      className="relative overflow-hidden bg-emerald text-cream-light"
    >
      <Toran className="absolute inset-x-0 top-0 h-6 w-full text-gold/60" />

      <div className="container grid items-center gap-8 py-14 md:grid-cols-2 md:py-16">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-light">
            Planning Your Nathdwara Visit?
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-[2.6rem]">
            Book Your Stay Today
          </h2>
          <p className="mt-4 max-w-md text-cream/80">
            Rooms fill up fast around festival and darshan days. Reach out on a
            call or WhatsApp and we&apos;ll hold the perfect room for you.
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            <Button asChild variant="white" size="lg">
              <a href={phones.telPrimary}>
                <Phone className="h-4 w-4" />
                Call Now {phones.primary}
              </a>
            </Button>
            <Button asChild variant="gold" size="lg">
              <a
                href={links.whatsappSecondary}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp {phones.secondary}
              </a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative hidden md:block">
          <div className="relative ml-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border-4 border-cream-light/20 ring-1 ring-gold/40">
            <Image
              src="/images/p1.png"
              alt="Shrinathji Temple in Nathdwara, a short walk from the homestay"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 0px, 40vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
