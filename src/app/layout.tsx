import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { business } from "@/data/business";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: "Fiambrería Hamdan | Fiambres y Quesos en Tucumán",
    template: "%s | Fiambrería Hamdan",
  },
  description:
    "Fiambrería Hamdan, desde 1992 en San Miguel de Tucumán. Tienda mayorista y minorista de fiambres, quesos, sándwiches y pizzas.",
  keywords: [
    "Fiambrería Hamdan",
    "fiambres Tucumán",
    "quesos Tucumán",
    "mayorista fiambres Tucumán",
    "sándwiches Tucumán",
    "pizzas Tucumán",
    "San Miguel de Tucumán",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: business.name,
    description: "Tradición, calidad y sabor tucumano desde 1992.",
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: business.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#8f1f23",
  colorScheme: "light",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: business.name,
  url: business.siteUrl,
  telephone: business.phoneDisplay,
  foundingDate: String(business.since),
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address,
    addressLocality: business.city,
    addressRegion: business.province,
    addressCountry: business.countryCode,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "13:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "18:00",
      closes: "21:30",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-AR">
      <body>
        {children}
        <WhatsAppFloat />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
