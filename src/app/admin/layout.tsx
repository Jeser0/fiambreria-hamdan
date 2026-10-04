import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Administración",
  description: "Panel privado de administración de Fiambrería Hamdan.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#fffaf0] px-5 pb-28 pt-8 text-[#382a22] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="checkout-focus inline-block rounded text-sm font-bold text-[#8f1f23]"
        >
          ← Volver a la tienda
        </Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-[#a5752b]">
          Fiambrería Hamdan · Administración
        </p>
        {children}
      </div>
    </main>
  );
}
