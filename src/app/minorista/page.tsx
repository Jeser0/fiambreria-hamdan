import type { Metadata } from "next";
import Link from "next/link";
import HamdanFooter from "@/components/HamdanFooter";
import HamdanHeader from "@/components/HamdanHeader";
import StoreCatalog from "@/components/StoreCatalog";
import StoreSwitcher from "@/components/StoreSwitcher";
import { BasketIcon, SparkIcon, WhatsAppIcon } from "@/components/Icons";
import type { CatalogCategoryId } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Tienda minorista",
  description:
    "Tienda minorista de Fiambrería Hamdan con quesos, fiambres, sándwiches y pizzas para el hogar, reuniones y eventos.",
  alternates: { canonical: "/minorista" },
};

type StorePageProps = {
  searchParams: Promise<{ q?: string | string[]; categoria?: string | string[] }>;
};

const validCategories: CatalogCategoryId[] = ["quesos", "fiambres", "sandwich-x4", "sandwich-x8", "pizzas"];

export default async function MinoristaPage({ searchParams }: StorePageProps) {
  const params = await searchParams;
  const query = Array.isArray(params.q) ? params.q[0] ?? "" : params.q ?? "";
  const requestedCategory = Array.isArray(params.categoria) ? params.categoria[0] : params.categoria;
  const initialCategory = validCategories.includes(requestedCategory as CatalogCategoryId)
    ? (requestedCategory as CatalogCategoryId)
    : "todos";

  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#382a22]">
      <HamdanHeader />

      <section className="paper-surface hero-magic relative overflow-hidden border-b border-[#7f241f]/10">
        <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="text-sm font-black text-[#8f1f23] transition hover:text-[#6f1719]">← Volver al inicio</Link>
            <StoreSwitcher mode="minorista" />
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4aa5e]/35 bg-[#fff8e6] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a6521]">
                <SparkIcon size={14} /> Compra por menor
              </div>
              <h1 className="font-display mt-5 max-w-4xl text-4xl font-black leading-[0.96] tracking-tight text-[#7c171c] sm:text-5xl lg:text-6xl">
                Tienda minorista
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#5e4a40]">
                Productos para tu mesa, reuniones y eventos. Armá el carrito sin mínimos mayoristas y mandá el pedido directamente por WhatsApp.
              </p>
            </div>

            <div className="rounded-3xl border border-[#d6ae55]/35 bg-[#fff0b7] p-6 text-[#3e2c1f] shadow-[0_18px_38px_rgba(130,91,24,0.10)]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/55"><BasketIcon size={23} /></span>
                <div>
                  <p className="font-display text-xl font-black text-[#5f271f]">Compra para tu casa</p>
                  <p className="mt-1 text-xs leading-5 text-[#6d584b]">Sin registro obligatorio y sin mezclar precios mayoristas.</p>
                </div>
              </div>
              <a href="https://wa.me/543813514449?text=Hola%20Hamdan%2C%20tengo%20una%20consulta%20sobre%20la%20tienda%20minorista." target="_blank" rel="noreferrer" className="cheese-action mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black">
                <WhatsAppIcon size={18} /> Consulta minorista
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="scroll-mt-36 py-12 lg:py-16">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-8">
          <div className="mb-7 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b27624]">Productos</p>
            <h2 className="font-display mt-2 text-4xl font-black text-[#7c171c]">Elegí qué querés comprar</h2>
            <p className="mt-3 text-sm leading-6 text-[#6e5a4f]">Los precios mostrados corresponden a la lista minorista provista por Hamdan.</p>
          </div>
          <StoreCatalog mode="minorista" initialQuery={query} initialCategory={initialCategory} />
        </div>
      </section>

      <HamdanFooter />
    </main>
  );
}
