import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/pedido"],
    },
    sitemap: "https://fiambreriahamdan.com/sitemap.xml",
  };
}
