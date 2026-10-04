import type { MetadataRoute } from "next";
import { business } from "@/data/business";
import { publicPages } from "@/data/seo";

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  // Omit lastModified until actual content update timestamps are available.
  return Object.values(publicPages).map(({ path }) => ({
    url: new URL(path, business.siteUrl).href,
  }));
}
