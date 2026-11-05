import { siteConfig } from "@/lib/site-config";
import { absoluteUrl, priceNumber, SITE_URL } from "@/lib/seo";
import { getBrand, getContact, getRooms, getTestimonials } from "@/lib/content-store";

/**
 * Renders any schema.org object as a JSON-LD script tag. Use this for
 * page-level schema (breadcrumbs, FAQs, rooms); the site-wide graph below
 * is emitted once from the root layout.
 */
export function Schema({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Site-wide structured data graph, emitted once in the root layout:
 *
 *   • Hotel / LodgingBusiness — the main local-SEO entity (NAP, geo,
 *     amenities, check-in times, room offers, ratings, reviews).
 *   • Organization — brand entity for the Knowledge Panel.
 *   • WebSite — ties every page back to one site entity.
 *
 * FAQPage is deliberately NOT here: Google only honours it when the Q&A is
 * visible on that page, so it is emitted from the pages that render the FAQ
 * section (home and contact).
 *
 * Everything reads from the database (with site-config fallbacks), so the
 * admin panel stays the single place to edit real business details.
 */
export async function JsonLd() {
  const [brand, contact, testimonials, rooms] = await Promise.all([
    getBrand(),
    getContact(),
    getTestimonials(),
    getRooms(),
  ]);
  const { address, phones, links } = contact;
  const { name, description } = brand;

  const hotelId = `${SITE_URL}/#lodging`;
  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;

  // Drop placeholder social links — a sameAs pointing at facebook.com's
  // homepage is worse than no sameAs at all.
  const sameAs = [links.instagram, links.facebook].filter(
    (u) => u && !/^https:\/\/(www\.)?facebook\.com\/?$/.test(u)
  );

  const photos = [
    "/images/og-image.jpg",
    "/images/rooms/makhan-chor/01.webp",
    "/images/room-family-enhanced.webp",
    "/images/room-premium-enhanced.webp",
    "/images/building.jpg",
  ].map((p) => `${SITE_URL}${p}`);

  const hotel = {
    "@type": ["Hotel", "LodgingBusiness"],
    "@id": hotelId,
    name,
    alternateName: [brand.shortName, "Shri Radha Home Stay Nathdwara"],
    description,
    url: SITE_URL,
    image: photos,
    ...(brand.logo ? { logo: `${SITE_URL}${brand.logo}` } : {}),
    telephone: phones.e164Primary,
    ...(phones.e164Secondary
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: phones.e164Secondary,
              contactType: "reservations",
              areaServed: "IN",
              availableLanguage: ["en", "hi"],
            },
          ],
        }
      : {}),
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Net Banking",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    ...(address.lat && address.lng
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: address.lat,
            longitude: address.lng,
          },
          hasMap: links.mapsDirections,
        }
      : {}),
    // Helps Google connect the property to "hotels near Shrinathji Temple".
    containedInPlace: {
      "@type": "City",
      name: "Nathdwara",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nathdwara",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
    },
    areaServed: ["Nathdwara", "Rajsamand", "Udaipur", "Rajasthan"],
    numberOfRooms: rooms.length,
    petsAllowed: false,
    smokingAllowed: false,
    checkinTime: siteConfig.checkInTime,
    checkoutTime: siteConfig.checkOutTime,
    availableLanguage: ["English", "Hindi"],
    ...(sameAs.length ? { sameAs } : {}),
    amenityFeature: siteConfig.facilities.map((f) => ({
      "@type": "LocationFeatureSpecification",
      name: f.label,
      value: true,
    })),
    makesOffer: rooms.map((room) => ({
      "@type": "Offer",
      name: room.name,
      url: absoluteUrl(`/rooms/${room.slug}`),
      price: priceNumber(room.priceNight),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      category: "Room booking",
    })),
    ...(testimonials.length
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (
              testimonials.reduce((sum, t) => sum + t.rating, 0) /
              testimonials.length
            ).toFixed(1),
            reviewCount: String(testimonials.length),
            bestRating: "5",
            worstRating: "1",
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
        }
      : {}),
    parentOrganization: { "@id": orgId },
  };

  const organization = {
    "@type": "Organization",
    "@id": orgId,
    name,
    url: SITE_URL,
    ...(brand.logo
      ? { logo: { "@type": "ImageObject", url: `${SITE_URL}${brand.logo}` } }
      : {}),
    description,
    telephone: phones.e164Primary,
    ...(sameAs.length ? { sameAs } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": siteId,
    url: SITE_URL,
    name,
    description,
    inLanguage: "en-IN",
    publisher: { "@id": orgId },
  };

  const homePage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: `Stay in Nathdwara Near Shrinathji Temple | ${name}`,
    isPartOf: { "@id": siteId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `${SITE_URL}/images/og-image.jpg`,
      width: 1200,
      height: 630,
      caption: `Guest room at ${name} in Nathdwara`,
    },
  };

  return (
    <Schema
      data={{
        "@context": "https://schema.org",
        "@graph": [hotel, organization, website, homePage],
      }}
    />
  );
}
