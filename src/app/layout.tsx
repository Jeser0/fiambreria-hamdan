import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import GoogleAdsTag from "@/components/GoogleAdsTag";
import MetaPixel from "@/components/MetaPixel";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { business } from "@/data/business";
import { businessStructuredData, publicPageMetadata, publicPages } from "@/data/seo";
import "./globals.css";

export const metadata: Metadata = {
  ...publicPageMetadata("home"),
  metadataBase: new URL(business.siteUrl),
  applicationName: business.name,
  title: {
    default: publicPages.home.title,
    template: "%s | Fiambrería Hamdan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#8f1f23",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-AR">
      <body>
        {children}
        <WhatsAppFloat />
        <GoogleAdsTag />
        <MetaPixel />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessStructuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
