import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Preparar pedido",
  description: "Revisión del carrito y datos para preparar un pedido de Fiambrería Hamdan.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function OrderLayout({ children }: { children: ReactNode }) {
  return children;
}
