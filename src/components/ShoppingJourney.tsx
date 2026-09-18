import Link from "next/link";
import { BasketIcon, ClipboardIcon, StoreIcon, WhatsAppIcon } from "./Icons";

const steps = [
  { n: "1", title: "Explorá", text: "Entrá al catálogo mayorista y buscá lo que necesitás.", icon: <StoreIcon size={28} /> },
  { n: "2", title: "Elegí productos", text: "Filtrá quesos, fiambres y alimentos disponibles para consulta.", icon: <BasketIcon size={28} /> },
  { n: "3", title: "Armá tu pedido", text: "Marcá productos y agregá cantidades o presentaciones.", icon: <ClipboardIcon size={28} /> },
  { n: "4", title: "Enviá la consulta", text: "Mandá el pedido por WhatsApp para confirmar precio y disponibilidad.", icon: <WhatsAppIcon size={28} /> },
];

export default function ShoppingJourney() {
  return (
    <section id="como-pedir" className="paper-surface scroll-mt-40 py-14 lg:py-16">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-5 sm:px-6 lg:grid-cols-[0.7fr_2fr_0.8fr] lg:px-8">
        <div className="flex flex-col justify-center rounded-3xl border border-[#8f1f23]/10 bg-[#fff8eb]/80 p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b27624]">Cómo pedir</p>
          <h2 className="font-display mt-2 text-4xl font-black leading-[0.95] text-[#7f1c21]">Tu compra mayorista, ordenada</h2>
          <p className="mt-4 text-sm leading-6 text-[#6e5a4f]">Elegí productos, anotá cantidades y enviá una sola consulta con todo el detalle.</p>
        </div>

        <div className="rounded-3xl border border-[#8f1f23]/10 bg-white/80 p-5 shadow-[0_12px_28px_rgba(84,48,30,0.06)]">
          <div className="grid gap-3 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.n} className="relative rounded-2xl bg-[#fffaf0] p-4">
                {index < steps.length - 1 && <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-2xl text-[#c5ae98] md:block">→</span>}
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c68a1d] text-sm font-black text-white">{step.n}</span>
                  <span className="text-[#8f1f23]">{step.icon}</span>
                </div>
                <h3 className="font-display mt-4 text-lg font-black text-[#7b2022]">{step.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#76645a]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-[#d6ae55]/35 bg-[#fff3c9] p-6 shadow-[0_12px_28px_rgba(130,91,24,0.08)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/65 text-[#21180f] shadow-sm"><BasketIcon size={22} /></div>
          <h3 className="font-display mt-4 text-2xl font-black text-[#56251f]">Sin registro obligatorio</h3>
          <p className="mt-3 text-sm leading-6 text-[#68574e]">Tu selección queda guardada en este dispositivo. Podés revisar el pedido y enviarlo cuando estés listo.</p>
          <Link href="/pedido" className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#21180f] px-4 py-3 text-sm font-black text-[#fff7dd] transition hover:-translate-y-0.5 hover:bg-[#35271a]">
            Ver mi pedido →
          </Link>
        </aside>
      </div>
    </section>
  );
}
