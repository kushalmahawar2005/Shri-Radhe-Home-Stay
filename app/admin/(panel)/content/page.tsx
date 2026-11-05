import Link from "next/link";
import { getContentRow } from "@/lib/db/queries";
import { siteConfig, faqs as defaultFaqs } from "@/lib/site-config";
import { BasicsForm, type BasicsData } from "@/components/admin/basics-form";
import { FaqEditor } from "@/components/admin/faq-editor";
import { TestimonialEditor } from "@/components/admin/testimonial-editor";

type Faq = { q: string; a: string };
type Testimonial = { quote: string; author: string; location: string; rating: number };

const tabs = [
  { id: "business", label: "Business" },
  { id: "faqs", label: "FAQs" },
  { id: "reviews", label: "Guest reviews" },
];

export default async function ContentPage({ searchParams }: { searchParams: { section?: string } }) {
  const section = tabs.some((tab) => tab.id === searchParams.section) ? searchParams.section! : "business";
  const [brand, contact, faqs, testimonials] = await Promise.all([
    getContentRow<BasicsData["brand"]>("brand"),
    getContentRow<BasicsData["contact"]>("contact"),
    getContentRow<Faq[]>("faqs"),
    getContentRow<Testimonial[]>("testimonials"),
  ]);

  const basics: BasicsData = {
    brand: brand ?? {
      name: siteConfig.name, shortName: siteConfig.shortName, tagline: siteConfig.tagline,
      description: siteConfig.description, intro: siteConfig.intro,
      templeWalkTime: siteConfig.templeWalkTime, logo: siteConfig.logo,
    },
    contact: contact ?? {
      phones: { primary: siteConfig.phones.primary, secondary: siteConfig.phones.secondary },
      address: siteConfig.address,
      links: {
        instagram: siteConfig.links.instagram, instagramHandle: siteConfig.links.instagramHandle,
        facebook: siteConfig.links.facebook, mapsEmbed: siteConfig.links.mapsEmbed,
        mapsDirections: siteConfig.links.mapsDirections,
      },
    },
  };

  return (
    <div>
      <p className="text-sm font-semibold text-emerald">Manage your website</p>
      <h1 className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">Website content</h1>
      <p className="mt-1 text-sm text-ink/55">Choose what you want to update.</p>

      <nav aria-label="Website content sections" className="mt-5 grid grid-cols-3 gap-1 rounded-2xl border border-gold/20 bg-cream-light p-1.5 sm:gap-2 sm:p-2">
        {tabs.map((tab) => (
          <Link key={tab.id} href={`/admin/content?section=${tab.id}`} aria-current={section === tab.id ? "page" : undefined} className={`flex min-h-11 items-center justify-center rounded-xl px-1 text-center text-xs font-semibold sm:px-3 sm:text-sm ${section === tab.id ? "bg-emerald text-white" : "text-ink/65 hover:bg-emerald/10"}`}>
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="mt-5">
        {section === "business" ? <BasicsForm data={basics} /> : null}
        {section === "faqs" ? <section><h2 className="mb-1 font-serif text-xl font-bold text-ink">Frequently asked questions</h2><p className="mb-4 text-sm text-ink/55">Add or edit the answers guests see on your website.</p><FaqEditor initial={faqs ?? defaultFaqs} /></section> : null}
        {section === "reviews" ? <section><h2 className="mb-1 font-serif text-xl font-bold text-ink">Guest reviews</h2><p className="mb-4 text-sm text-ink/55">Manage the reviews shown on your website.</p><TestimonialEditor initial={testimonials ?? [...siteConfig.testimonials]} /></section> : null}
      </div>
    </div>
  );
}
