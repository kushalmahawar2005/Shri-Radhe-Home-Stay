import { Hero } from "@/components/hero";
import { QuickFacts } from "@/components/quick-facts";
import { About } from "@/components/about";
import { Rooms } from "@/components/rooms";
import { GreenBand } from "@/components/green-band";
import { DivineEnergy } from "@/components/divine-energy";
import { Facilities } from "@/components/facilities";
import { Nearby } from "@/components/nearby";
import { Testimonials } from "@/components/testimonials";
import { FindUs } from "@/components/find-us";
import { CtaBand } from "@/components/cta-band";
import { SeoIntro } from "@/components/seo-intro";
import { FaqAccordion } from "@/components/faq-accordion";
import { SectionHeading } from "@/components/section-heading";
import { Schema } from "@/components/json-ld";
import { faqSchema } from "@/lib/seo";
import { getRooms, getTestimonials, getFaqs } from "@/lib/content-store";

// Rendered on the server with rooms from the DB; refreshed hourly and
// on-demand whenever the admin saves a room.
export const revalidate = 3600;

export default async function HomePage() {
  const [rooms, testimonials, faqs] = await Promise.all([
    getRooms(),
    getTestimonials(),
    getFaqs(),
  ]);
  return (
    <>
      {/* The FAQ section below is visible on this page, so the rich result
          is eligible here. */}
      {faqs.length ? <Schema data={faqSchema(faqs)} /> : null}

      <Hero />
      <QuickFacts />
      <About />
      <Rooms rooms={rooms} />
      <GreenBand />
      <DivineEnergy />

      {/* Facilities · Nearby Attractions · Guest reviews — three-column row */}
      <section className="heritage-wash relative isolate overflow-hidden bg-cream-alt py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-cream-alt/70" aria-hidden="true" />
        <div className="container relative z-10 grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-3 lg:items-start">
          <Facilities compact />
          <Nearby compact />
          <Testimonials compact items={testimonials} />
        </div>
      </section>

      <SeoIntro />

      {faqs.length ? (
        <section className="heritage-wash relative isolate overflow-hidden bg-cream-alt py-14 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-cream-alt/65" aria-hidden="true" />
          <div className="container relative z-10">
            <SectionHeading
              eyebrow="Before You Book"
              title="Frequently Asked Questions"
              highlight="Questions"
            />
            <FaqAccordion faqs={faqs} />
          </div>
        </section>
      ) : null}

      <FindUs />
      <CtaBand />
    </>
  );
}
