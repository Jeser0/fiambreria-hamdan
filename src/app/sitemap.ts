import type { MetadataRoute } from "next";
import { business } from "@/data/business";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: business.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${business.siteUrl}/mayorista`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${business.siteUrl}/minorista`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
