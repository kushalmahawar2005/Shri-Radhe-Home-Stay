import { getContentRow } from "@/lib/db/queries";
import { siteConfig, faqs as defaultFaqs } from "@/lib/site-config";
import { BasicsForm, type BasicsData } from "@/components/admin/basics-form";
import { FaqEditor } from "@/components/admin/faq-editor";
import { TestimonialEditor } from "@/components/admin/testimonial-editor";

type Faq = { q: string; a: string };
type Testimonial = {
  quote: string;
  author: string;
  location: string;
  rating: number;
};

export default async function ContentPage() {
  const [brand, contact, faqs, testimonials] = await Promise.all([
    getContentRow<BasicsData["brand"]>("brand"),
    getContentRow<BasicsData["contact"]>("contact"),
    getContentRow<Faq[]>("faqs"),
    getContentRow<Testimonial[]>("testimonials"),
  ]);

  const basics: BasicsData = {
    brand: brand ?? {
      name: siteConfig.name,
      shortName: siteConfig.shortName,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      intro: siteConfig.intro,
      templeWalkTime: siteConfig.templeWalkTime,
      logo: siteConfig.logo,
    },
    contact: contact ?? {
      phones: {
        primary: siteConfig.phones.primary,
        secondary: siteConfig.phones.secondary,
      },
      address: siteConfig.address,
      links: {
        instagram: siteConfig.links.instagram,
        instagramHandle: siteConfig.links.instagramHandle,
        facebook: siteConfig.links.facebook,
        mapsEmbed: siteConfig.links.mapsEmbed,
        mapsDirections: siteConfig.links.mapsDirections,
      },
    },
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink">Site Content</h1>
      <p className="mt-1 text-sm text-ink/55">
        Phone, address, links, FAQs aur reviews edit karo. Save karte hi website
        update ho jaayegi.
      </p>

      <nav className="mt-5 flex flex-wrap gap-2 text-sm">
        <a href="#basics" className="rounded-full bg-emerald/10 px-3 py-1.5 font-medium text-emerald">
          Contact & basics
        </a>
        <a href="#faqs" className="rounded-full bg-emerald/10 px-3 py-1.5 font-medium text-emerald">
          FAQs
        </a>
        <a href="#reviews" className="rounded-full bg-emerald/10 px-3 py-1.5 font-medium text-emerald">
          Reviews
        </a>
      </nav>

      <section id="basics" className="mt-8 scroll-mt-6">
        <BasicsForm data={basics} />
      </section>

      <section id="faqs" className="mt-12 scroll-mt-6">
        <h2 className="mb-4 font-serif text-xl font-bold text-ink">FAQs</h2>
        <FaqEditor initial={faqs ?? defaultFaqs} />
      </section>

      <section id="reviews" className="mt-12 scroll-mt-6">
        <h2 className="mb-4 font-serif text-xl font-bold text-ink">
          Guest Reviews
        </h2>
        <TestimonialEditor initial={testimonials ?? [...siteConfig.testimonials]} />
      </section>
    </div>
  );
}
