import type { Metadata } from "next";
import Link from "next/link";
import HamdanFooter from "@/components/HamdanFooter";
import HamdanHeader from "@/components/HamdanHeader";
import WholesaleCatalog from "@/components/WholesaleCatalog";
import { BoxIcon, SparkIcon, WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Catálogo mayorista",
  description:
    "Catálogo mayorista de Fiambrería Hamdan para comercios y gastronomía en Tucumán. Consultá quesos, fiambres, alimentos, disponibilidad y precios vigentes.",
};

type MayoristaPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    categoria?: string | string[];
  }>;
};

export default async function MayoristaPage({ searchParams }: MayoristaPageProps) {
  const params = await searchParams;
  const query = Array.isArray(params.q) ? params.q[0] ?? "" : params.q ?? "";
  const requestedCategory = Array.isArray(params.categoria)
    ? params.categoria[0]
    : params.categoria;
  const initialCategory =
    requestedCategory === "quesos" ||
    requestedCategory === "fiambres" ||
    requestedCategory === "alimentos"
      ? requestedCategory
      : "todos";

  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#382a22]">
      <HamdanHeader />

      <section className="paper-surface hero-magic relative overflow-hidden border-b border-[#7f241f]/10">
        <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link href="/" className="text-sm font-black text-[#8f1f23] transition hover:text-[#6f1719]">← Volver al inicio</Link>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4aa5e]/35 bg-[#fff8e6] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a6521]">
                <SparkIcon size={14} /> Hamdan Distribuciones
              </div>
              <h1 className="font-display mt-5 max-w-4xl text-4xl font-black leading-[0.96] tracking-tight text-[#7c171c] sm:text-5xl lg:text-6xl">
                Catálogo y consulta mayorista
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#5e4a40]">
                Una sección separada para comercios, despensas, almacenes y gastronomía. Elegí lo que necesitás y prepará una consulta sin mezclarla con la futura compra minorista.
              </p>
            </div>

            <div className="rounded-3xl border border-[#8f1f23]/12 bg-[#8f1f23] p-6 text-[#fff6e8] shadow-[0_18px_38px_rgba(105,25,28,0.14)]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"><BoxIcon size={23} /></span>
                <div>
                  <p className="font-display text-xl font-black">¿Necesitás algo específico?</p>
                  <p className="mt-1 text-xs leading-5 text-[#f8dfcf]/80">Consultanos y revisamos disponibilidad.</p>
                </div>
              </div>
              <a href="https://wa.me/543813514449?text=Hola%20Hamdan%2C%20quisiera%20hacer%20una%20consulta%20mayorista." target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-black transition hover:bg-white/15">
                <WhatsAppIcon size={18} /> Hablar con mayorista
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="scroll-mt-36 py-12 lg:py-16">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-8">
          <div className="mb-7 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b27624]">Productos</p>
            <h2 className="font-display mt-2 text-4xl font-black text-[#7c171c]">Elegí qué querés consultar</h2>
            <p className="mt-3 text-sm leading-6 text-[#6e5a4f]">No mostramos precios desactualizados: el valor final y la disponibilidad se confirman con el equipo de Hamdan al momento del pedido.</p>
          </div>
          <WholesaleCatalog initialQuery={query} initialCategory={initialCategory} />
        </div>
      </section>

      <HamdanFooter />
    </main>
  );
}
