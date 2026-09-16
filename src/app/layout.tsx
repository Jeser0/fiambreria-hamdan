import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fiambreriahamdan.com"),
  title: {
    default: "Fiambrería Hamdan | Fiambres y Quesos en Tucumán",
    template: "%s | Fiambrería Hamdan",
  },
  description:
    "Fiambrería Hamdan, desde 1992 en San Miguel de Tucumán. Fiambres, quesos, lácteos, alimentos y atención mayorista.",
  keywords: [
    "Fiambrería Hamdan",
    "fiambres Tucumán",
    "quesos Tucumán",
    "mayorista fiambres Tucumán",
    "San Miguel de Tucumán",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fiambrería Hamdan",
    description: "Tradición, calidad y sabor tucumano desde 1992.",
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Fiambrería Hamdan",
  },
};

export const viewport: Viewport = {
  themeColor: "#8f1f23",
  colorScheme: "light",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Fiambrería Hamdan",
  url: "https://fiambreriahamdan.com",
  telephone: "+54 381 255 0960",
  foundingDate: "1992",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Colón 340",
    addressLocality: "San Miguel de Tucumán",
    addressRegion: "Tucumán",
    addressCountry: "AR",
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
