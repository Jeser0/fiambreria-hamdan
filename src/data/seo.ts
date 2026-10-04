import type { Metadata } from "next";
import { business } from "./business";

// Only canonical, indexable pages. Categories and home sections share these URLs.
export const publicPages = {
  home: {
    path: "/",
    title: "Fiambrería Hamdan | Fiambres, Quesos, Pizzas y Sándwiches en Tucumán",
    description:
      "Fiambres, quesos, pizzas y sándwiches en San Miguel de Tucumán. Fiambrería Hamdan, desde 1992: venta mayorista para comercios y minorista para tu mesa.",
  },
  wholesale: {
    path: "/mayorista",
    title: "Venta mayorista de alimentos en Tucumán | Fiambrería Hamdan",
    description:
      "Fiambres, quesos, pizzas y sándwiches por mayor en San Miguel de Tucumán. Fiambrería Hamdan: catálogo para comercios, reventa y gastronomía.",
  },
  retail: {
    path: "/minorista",
    title: "Fiambres y quesos en Tucumán | Tienda minorista Hamdan",
    description:
      "Comprá fiambres, quesos, pizzas y sándwiches en San Miguel de Tucumán. Catálogo minorista de Fiambrería Hamdan para tu mesa, reuniones y picadas.",
  },
} as const;

const storefront = {
  url: new URL("/brand/storefront.webp", business.siteUrl).href,
  width: 1800,
  height: 759,
  alt: `Fachada de ${business.name} en ${business.address}, ${business.city}`,
};

export function publicPageMetadata(page: keyof typeof publicPages): Metadata {
  const { path, title, description } = publicPages[page];
  const url = new URL(path, business.siteUrl).href;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: business.name,
      url,
      title,
      description,
      images: [storefront],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: storefront.url, alt: storefront.alt }],
    },
  };
}

const siteUrl = new URL("/", business.siteUrl).href;
const businessId = `${siteUrl}#business`;

export const businessStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Store", "Organization"],
      "@id": businessId,
      name: business.name,
      url: siteUrl,
      description: publicPages.home.description,
      logo: {
        "@type": "ImageObject",
        url: new URL("/brand/logo-hamdan.webp", siteUrl).href,
        width: 150,
        height: 150,
      },
      image: {
        "@type": "ImageObject",
        url: storefront.url,
        width: storefront.width,
        height: storefront.height,
        caption: storefront.alt,
      },
      telephone: business.phoneDisplay,
      foundingDate: String(business.since),
      hasMap: business.mapsUrl,
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address,
        addressLocality: business.city,
        addressRegion: business.province,
        addressCountry: business.countryCode,
      },
      openingHoursSpecification: [
        business.hours.firstShift,
        business.hours.secondShift,
      ].map((shift) => {
        const [opens, closes] = shift.split("–");
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens,
          closes,
        };
      }),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: business.name,
      inLanguage: "es-AR",
      publisher: { "@id": businessId },
    },
  ],
};
