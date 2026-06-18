import { siteConfig } from "@/lib/site-config";

/** LodgingBusiness JSON-LD structured data (real NAP). */
export function JsonLd() {
  const { address, phones, links, url, name, description } = siteConfig;

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
      reviewCount: String(siteConfig.testimonials.length),
    },
    review: siteConfig.testimonials.map((t) => ({
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
