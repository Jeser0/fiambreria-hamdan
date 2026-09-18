import Link from "next/link";
import { BoxIcon } from "./Icons";

function CheeseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 16 12 5l8 4-8 10-8-3Z" /><path d="M12 5v14" /><circle cx="15" cy="10" r="1" /><circle cx="9" cy="13" r="1" />
    </svg>
  );
}

function HamIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 18c-2-2-1.6-5.4.7-8.1C9.1 7 13 5.6 16 6.7c3.2 1.2 4.9 4.8 3.5 7.9-1.2 2.8-4.8 4.6-8.3 4.4-2.1-.1-4-.5-5.2-1Z" /><circle cx="16" cy="11" r="1.3" /><path d="M7 10 4 7m1 5-3-1" />
    </svg>
  );
}

function SandwichIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m4 9 8-4 8 4-8 4-8-4Z" /><path d="m5 13 7 3 7-3M6 17l6 3 6-3" />
    </svg>
  );
}

const cards = [
  { title: "Fiambres", category: "fiambres", icon: <HamIcon />, tone: "text-[#8f1f23]" },
  { title: "Quesos y lácteos", category: "quesos", icon: <CheeseIcon />, tone: "text-[#b66d0f]" },
  { title: "Sándwich x4", category: "sandwich-x4", icon: <SandwichIcon />, tone: "text-[#8f1f23]" },
  { title: "Sándwich x8", category: "sandwich-x8", icon: <SandwichIcon />, tone: "text-[#8f1f23]" },
  { title: "Pizzas", category: "pizzas", icon: <BoxIcon size={28} />, tone: "text-[#b66d0f]" },
] as const;

export default function SectionGateways() {
  return (
    <section id="secciones" aria-label="Categorías principales" className="scroll-mt-40 border-y border-[#7f241f]/10 bg-[#fff7e9] py-8">
      <div className="mx-auto max-w-[1350px] px-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aa6d1f]">Explorar categorías</p>
            <h2 className="font-display mt-1 text-2xl font-black text-[#702025] sm:text-3xl">Elegí qué buscás y cómo querés comprar</h2>
          </div>
          <p className="max-w-md text-xs leading-5 text-[#786358]">Cada categoría te deja entrar directamente a la tienda mayorista o minorista, sin mezclar precios ni carritos.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((card) => (
            <article
              key={card.title}
              className="gateway-card group flex min-h-40 flex-col rounded-2xl border border-[#7d3c32]/12 bg-[#fffdf7] p-4 shadow-[0_8px_20px_rgba(78,45,26,0.05)]"
            >
              <div className={`gateway-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fbefdd] ${card.tone}`}>
                {card.icon}
              </div>
              <h3 className="font-display mt-4 text-lg font-black leading-tight text-[#762025]">{card.title}</h3>
              <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                <Link
                  href={`/mayorista?categoria=${card.category}#catalogo`}
                  className="soft-press rounded-lg bg-[#fff0b7] px-2.5 py-2 text-center text-[11px] font-black text-[#3d2b1e] transition hover:bg-[#ffe59a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a13a]"
                >
                  Mayorista
                </Link>
                <Link
                  href={`/minorista?categoria=${card.category}#catalogo`}
                  className="soft-press rounded-lg border border-[#8f1f23]/12 bg-white px-2.5 py-2 text-center text-[11px] font-black text-[#7a2022] transition hover:bg-[#fff4e7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a13a]"
                >
                  Minorista
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
