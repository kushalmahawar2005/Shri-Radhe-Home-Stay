import type { Metadata } from "next";
import { Phone, MessageCircle, MapPin, Instagram, Clock, Plus } from "lucide-react";
import { getBrand, getContact, getFaqs } from "@/lib/content-store";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";

// Refreshed hourly and on-demand whenever the admin saves site content.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact & Location — Home Stay in Nathdwara",
  description:
    "Contact Shri Radha Villa Stay, Nathdwara. Call or WhatsApp 8619301401 / 9799496789 for room availability and the best price. Haldighati Road, Nathdwara — an 8 minute walk from Shrinathji Temple.",
  keywords: [
    "Nathdwara home stay contact number",
    "hotel booking number Nathdwara",
    "Shrinathji Temple nearby stay address",
  ],
  alternates: { canonical: "/contact/" },
};

export default async function ContactPage() {
  const [brand, contact, faqs] = await Promise.all([
    getBrand(),
    getContact(),
    getFaqs(),
  ]);
  const { address, phones, links } = contact;

  return (
    <>
      {/* The Q&A below is visible on this page, so the FAQ rich result is
          eligible here (it is not emitted site-wide). */}
      {faqs.length ? <Schema data={faqSchema(faqs)} /> : null}
      <Schema
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <section className="bg-cream-gradient pb-3 pt-5 sm:pb-6 sm:pt-10 md:pt-12">
        <div className="container">
          <h1 className="font-serif text-3xl font-bold leading-tight text-emerald sm:text-4xl">Contact &amp; Location</h1>
          <p className="mt-1 text-sm leading-5 text-ink/65 sm:mt-2 sm:text-base">Ask about rooms, dates or your Nathdwara visit.</p>
        </div>
      </section>

      <section className="bg-cream pb-8 pt-2 sm:py-10 md:py-14">
        <div className="container grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-2">
          {/* details + actions */}
          <Reveal className="order-2 flex min-w-0 flex-col gap-4 lg:order-1 sm:gap-6">
            <div className="rounded-[1rem] border border-gold/30 bg-cream-light p-4 shadow-card sm:rounded-2xl sm:p-7">
              <h2 className="font-serif text-xl font-semibold text-emerald sm:text-2xl">
                {brand.name}
              </h2>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-ink/80 sm:mt-5 sm:space-y-4 sm:text-base">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
                  <span>{address.full}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
                  <span className="flex flex-col">
                    <a className="hover:text-emerald" href={phones.telPrimary}>
                      {phones.primary}
                    </a>
                    <a className="hover:text-emerald" href={phones.telSecondary}>
                      {phones.secondary}
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Instagram className="h-5 w-5 shrink-0 text-gold-dark" />
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald"
                  >
                    {links.instagramHandle}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 shrink-0 text-gold-dark" />
                  <span>Reception open 24x7</span>
                </li>
              </ul>

              <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                <Button asChild variant="primary" size="sm">
                  <a href={phones.telPrimary}>
                    <Phone className="h-4 w-4" /> Call Now
                  </a>
                </Button>
                <Button asChild variant="gold" size="sm">
                  <a
                    href={links.whatsappPrimary}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gold/30 shadow-card">
              <iframe
                title={`Map showing ${brand.name} in Nathdwara`}
                src={links.mapsEmbed}
                className="h-[200px] w-full sm:h-[280px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={0.1} className="order-1 min-w-0 lg:order-2">
            <h2 className="mb-3 font-serif text-xl font-semibold text-ink sm:mb-4 sm:text-2xl">
              Enquire on WhatsApp
            </h2>
            <ContactForm
              whatsappNumber={phones.e164Primary.replace("+", "")}
            />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream-alt py-6 sm:py-10 md:py-14">
        <div className="container max-w-3xl">
          <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Frequently Asked Questions</h2>

          <div className="mt-4 flex flex-col gap-3 sm:mt-8">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[1rem] border border-gold/30 bg-cream-light p-4 shadow-soft sm:rounded-2xl sm:p-5 [&_summary]:list-none"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 font-serif text-base font-semibold leading-5 text-ink sm:text-lg">
                  {faq.q}
                  <Plus className="h-5 w-5 shrink-0 text-emerald transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
