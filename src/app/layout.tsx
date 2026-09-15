import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
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
  openGraph: {
    title: "Fiambrería Hamdan",
    description: "Tradición, calidad y sabor tucumano desde 1992.",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#8f1f23",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
