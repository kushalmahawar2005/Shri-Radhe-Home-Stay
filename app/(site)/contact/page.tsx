import type { Metadata } from "next";
import { Phone, MessageCircle, MapPin, Instagram, Clock, Plus } from "lucide-react";
import { getBrand, getContact, getFaqs } from "@/lib/content-store";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
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

      <section className="bg-cream-gradient py-14 md:py-20">
        <div className="container">
          <SectionHeading
            as="h1"
            eyebrow="Get in Touch"
            title="Contact & Location — Nathdwara"
            highlight="Contact"
            subtitle="Have a question or ready to book? Call, WhatsApp or drop us a message — we usually reply within minutes."
          />
        </div>
      </section>

      <section className="bg-cream py-14 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-2">
          {/* details + actions */}
          <Reveal className="flex flex-col gap-6">
            <div className="rounded-2xl border border-gold/30 bg-cream-light p-7 shadow-card">
              <h2 className="font-serif text-2xl font-semibold text-emerald">
                {brand.name}
              </h2>
              <ul className="mt-5 space-y-4 text-ink/80">
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

              <div className="mt-6 flex flex-wrap gap-3">
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
                className="h-[280px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={0.1}>
            <h2 className="mb-4 font-serif text-2xl font-semibold text-ink">
              Send us a message
            </h2>
            <ContactForm
              whatsappPrimary={links.whatsappPrimary}
              whatsappNumber={phones.e164Primary.replace("+", "")}
            />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream-alt py-14 md:py-20">
        <div className="container max-w-3xl">
          <SectionHeading
            eyebrow="Good to Know"
            title="Frequently Asked Questions"
            highlight="Questions"
          />

          <div className="mt-10 flex flex-col gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-gold/30 bg-cream-light p-5 shadow-soft [&_summary]:list-none"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg font-semibold text-ink">
                  {faq.q}
                  <Plus className="h-5 w-5 shrink-0 text-emerald transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="mt-3 leading-relaxed text-ink/70">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
