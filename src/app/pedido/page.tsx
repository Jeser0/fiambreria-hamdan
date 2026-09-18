import type { Metadata } from "next";
import Link from "next/link";
import HamdanFooter from "@/components/HamdanFooter";
import HamdanHeader from "@/components/HamdanHeader";
import WholesaleOrderSummary from "@/components/WholesaleOrderSummary";
import { SparkIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Mi pedido mayorista",
  description: "Revisá y enviá tu consulta mayorista a Fiambrería Hamdan.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PedidoPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#382a22]">
      <HamdanHeader />

      <section className="paper-surface hero-magic border-b border-[#7f241f]/10">
        <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-6 lg:px-8 lg:py-12">
          <Link href="/mayorista#catalogo" className="text-sm font-black text-[#8f1f23] transition hover:text-[#6f1719]">← Volver al catálogo</Link>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d4aa5e]/35 bg-[#fff8e6] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a6521]">
            <SparkIcon size={14} /> Pedido mayorista
          </div>
          <h1 className="font-display mt-4 text-4xl font-black leading-[0.98] text-[#7c171c] sm:text-5xl">Revisá tu pedido</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#67544a] sm:text-base">Tu selección se guarda en este dispositivo. Completá cantidades, revisá el resumen y envialo directamente a Hamdan.</p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-8">
          <WholesaleOrderSummary />
        </div>
      </section>

      <HamdanFooter />
    </main>
  );
}
