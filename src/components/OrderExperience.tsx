import Link from "next/link";
import { BasketIcon, BoxIcon, ClipboardIcon, SparkIcon, WhatsAppIcon } from "./Icons";
import ScrollReveal from "./ScrollReveal";

export default function OrderExperience() {
  return (
    <section id="mayorista" className="scroll-mt-40 bg-[#fff7e8] py-14 lg:py-16">
      <ScrollReveal className="mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="wood-card relative overflow-hidden rounded-[2rem] p-7 text-[#fff7e5] shadow-[0_20px_45px_rgba(82,29,23,0.16)] sm:p-9">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#f5ca63]/20" />
          <div className="absolute right-12 top-12 text-[#f6c65a]/70"><SparkIcon size={24} /></div>
          <div className="relative grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f2c86c]">Hamdan Distribuciones</p>
              <h2 className="font-display mt-3 text-4xl font-black leading-none sm:text-5xl">Pedidos por mayor</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#f8e7cf]/80 sm:text-base">
                Una sección pensada para comercios, despensas, almacenes, autoservicios y gastronomía. Elegí productos y armá una consulta ordenada para confirmar disponibilidad y precio vigente.
              </p>
            </div>
            <div className="flex min-w-52 flex-col gap-3">
              <Link href="/mayorista" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#f1d9b4]/45 bg-[#fff7e5]/12 px-5 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#fff7e5]/18">
                <BoxIcon size={18} /> Ver catálogo mayorista
              </Link>
              <a href="https://wa.me/543813514449?text=Hola%20Hamdan%2C%20quisiera%20hacer%20una%20consulta%20mayorista." target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#f1d9b4]/45 bg-[#fff7e5]/12 px-5 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#fff7e5]/18">
                <WhatsAppIcon size={19} /> Consultar mayorista
              </a>
            </div>
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-[2rem] border border-[#d6ae55]/35 bg-[#fff0b7] p-7 text-[#251b12] shadow-[0_20px_45px_rgba(130,91,24,0.12)] sm:p-8">
          <SparkIcon size={18} className="absolute right-8 top-7 text-[#b77a12]" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9f6817]">Pedido guardado</p>
              <h2 className="font-display mt-2 text-3xl font-black leading-none text-[#59251f]">Tu pedido, a un clic</h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/55 text-[#251b12] shadow-inner"><BasketIcon size={28} /></div>
          </div>
          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl border border-[#6f4813]/10 bg-white/35 px-4 py-3"><BasketIcon size={18} className="text-[#8f1f23]" /><span>Agregá productos desde el catálogo</span></div>
            <div className="flex items-center gap-3 rounded-xl border border-[#6f4813]/10 bg-white/35 px-4 py-3"><ClipboardIcon size={18} className="text-[#8f1f23]" /><span>Completá cantidades y observaciones</span></div>
            <div className="flex items-center gap-3 rounded-xl border border-[#6f4813]/10 bg-white/35 px-4 py-3"><WhatsAppIcon size={18} className="text-[#0b7145]" /><span>Enviá el resumen directo a Hamdan</span></div>
          </div>
          <Link href="/pedido" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#251b12] px-5 py-3.5 text-sm font-black text-[#fff6dc] transition hover:-translate-y-0.5 hover:bg-[#3a2a1b]">
            Revisar mi pedido →
          </Link>
        </aside>
        </div>
      </ScrollReveal>
    </section>
  );
}
