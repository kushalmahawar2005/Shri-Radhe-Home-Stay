import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date();

  const roomPages: MetadataRoute.Sitemap = siteConfig.rooms.map((room) => ({
    url: `${base}/rooms/${room.slug}/`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: `${base}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${base}/rooms/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...roomPages,
    {
      url: `${base}/gallery/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/attractions/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/about/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${base}/booking/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/contact/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
