import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

/**
 * Every indexable URL, most important first. `/booking/success` and the
 * whole admin panel are deliberately absent (see app/robots.ts).
 */
const PAGES: Entry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  // Keyword landing pages — the pages built to rank for the money queries.
  { path: "/stay-near-shrinathji-temple", priority: 0.9, changeFrequency: "monthly" },
  { path: "/rooms", priority: 0.9, changeFrequency: "weekly" },
  { path: "/booking", priority: 0.8, changeFrequency: "weekly" },
  { path: "/nathdwara-guide", priority: 0.8, changeFrequency: "monthly" },
  { path: "/attractions", priority: 0.7, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const roomPages: MetadataRoute.Sitemap = siteConfig.rooms.map((room) => ({
    url: absoluteUrl(`/rooms/${room.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    ...PAGES.map((p) => ({
      url: absoluteUrl(p.path),
      lastModified,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...roomPages,
  ];
}
