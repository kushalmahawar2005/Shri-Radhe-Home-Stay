import { siteConfig } from "@/lib/site-config";
import { getBrand, getContact, getTestimonials } from "@/lib/content-store";

/** LodgingBusiness JSON-LD structured data (real NAP). */
export async function JsonLd() {
  const [brand, contact, testimonials] = await Promise.all([
    getBrand(),
    getContact(),
    getTestimonials(),
  ]);
  const { address, phones, links } = contact;
  const { url } = siteConfig;
  const { name, description } = brand;

  const data = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name,
    description,
    url,
    image: `${url}/images/building.jpg`,
    telephone: phones.e164Primary,
    priceRange: "On Request",
    currenciesAccepted: "INR",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.lat,
      longitude: address.lng,
    },
    sameAs: [links.instagram, links.facebook],
    amenityFeature: siteConfig.facilities.map((f) => ({
      "@type": "LocationFeatureSpecification",
      name: f.label,
      value: true,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: String(testimonials.length),
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(t.rating),
        bestRating: "5",
      },
      reviewBody: t.quote,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
