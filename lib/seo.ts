/**
 * ────────────────────────────────────────────────────────────────────────
 *  SEO helpers — canonical URLs, keyword sets and JSON-LD builders.
 *
 *  `trailingSlash: true` is on in next.config.js, so every canonical and
 *  every sitemap entry must end with a slash or Google sees two URLs for
 *  the same page.
 * ────────────────────────────────────────────────────────────────────────
 */

import { siteConfig } from "@/lib/site-config";

/** Absolute site URL, no trailing slash. */
export const SITE_URL = siteConfig.url;

/** Path → canonical path with a trailing slash ("/rooms" → "/rooms/"). */
export function canonical(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return path.endsWith("/") ? path : `${path}/`;
}

/** Path → absolute URL with a trailing slash. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${canonical(path)}`;
}

/* ──────────────────────────────────────────────────────────────────────
 *  KEYWORDS — the search phrases each page is built to rank for.
 *  Used for <meta keywords> and, more importantly, as the checklist the
 *  page copy itself is written against.
 * ──────────────────────────────────────────────────────────────────── */

/** Core commercial cluster — highest-intent "book a stay" searches. */
export const CORE_KEYWORDS = [
  "home stay in Nathdwara",
  "homestay Nathdwara",
  "home stay near Nathdwara",
  "villa stay Nathdwara",
  "hotel in Nathdwara",
  "hotels near Shrinathji Temple",
  "stay near Shrinathji Temple Nathdwara",
  "Nathdwara accommodation",
  "guest house in Nathdwara",
  "budget hotel Nathdwara",
  "cheap hotels in Nathdwara near temple",
  "AC rooms in Nathdwara",
  "family rooms Nathdwara",
  "rooms near Shrinathji Temple",
  "Nathdwara dharamshala alternative",
  "best homestay in Nathdwara",
  "online room booking Nathdwara",
  "Nathdwara hotel booking",
  "Shri Radha Villa Stay",
  "Shri Radha Home Stay Nathdwara",
];

/** Location / travel cluster — informational searches that feed the funnel. */
export const LOCAL_KEYWORDS = [
  "Nathdwara",
  "Nathdwara Rajasthan",
  "Shrinathji Temple Nathdwara",
  "Shrinathji darshan timing",
  "Nathdwara temple timings",
  "how to reach Nathdwara",
  "Nathdwara to Udaipur distance",
  "places to visit in Nathdwara",
  "Nathdwara tourist places",
  "Statue of Belief Nathdwara",
  "Vishwas Swaroopam Nathdwara",
  "Haldighati Nathdwara",
  "Kumbhalgarh Fort from Nathdwara",
  "Eklingji Temple",
  "Nathdwara trip plan",
  "best time to visit Nathdwara",
  "Nathdwara pilgrimage stay",
  "Nathdwara darshan and stay package",
];

/** Hindi / Hinglish variants — a large share of local search is typed this way. */
export const HINDI_KEYWORDS = [
  "नाथद्वारा होम स्टे",
  "श्रीनाथजी मंदिर के पास होटल",
  "नाथद्वारा में रुकने की जगह",
  "Nathdwara me hotel",
  "Shrinathji mandir ke pass hotel",
  "Nathdwara room booking",
];

export const ALL_KEYWORDS = [
  ...CORE_KEYWORDS,
  ...LOCAL_KEYWORDS,
  ...HINDI_KEYWORDS,
];

/* ──────────────────────────────────────────────────────────────────────
 *  JSON-LD builders
 * ──────────────────────────────────────────────────────────────────── */

/** Breadcrumb trail. Pass items in order, root first, current page last. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** FAQ rich result. Google shows these directly under the listing. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Strips the ₹ and commas off a price label so schema gets a number. */
export function priceNumber(label: string): string {
  return label.replace(/[^\d.]/g, "");
}
