import type { ReactNode } from "react";
import Link from "next/link";

function CategoryIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

function CheeseIcon() {
  return (
    <CategoryIcon>
      <path d="m3.5 12 16-8 5 8v11h-21V12Z" />
      <path d="M3.5 12h21" />
      <circle cx="9" cy="17" r="1.5" />
      <circle cx="18" cy="19" r="1.8" />
      <path d="M15 8.5h.01" />
    </CategoryIcon>
  );
}

function HamIcon() {
  return (
    <CategoryIcon>
      <path d="m19.5 5.5-9.5-2C6 2.7 3.2 5.6 3.8 9.5l1.7 10c.4 2.4 2.5 3.8 4.8 3.3l10.5-2" />
      <ellipse cx="19" cy="13.5" rx="5.5" ry="8" transform="rotate(-12 19 13.5)" />
      <path d="m8 8 3 1M8.5 17l3 .5" />
      <circle cx="17.5" cy="10.5" r=".8" />
      <circle cx="20.5" cy="13.5" r=".8" />
      <circle cx="18.5" cy="17" r=".8" />
    </CategoryIcon>
  );
}

function SandwichIcon({ count }: { count: 4 | 8 }) {
  return (
    <CategoryIcon>
      <path d="m3.5 8.5 10-5 10 5-10 5-10-5Z" />
      <path d="m3.5 12 10 5 10-5M3.5 15.5l10 5" />
      {count === 8 && <path d="m3.5 19 5 2.5M6.5 22l4 2" />}
      <rect x="14" y="18" width="12" height="8.5" rx="2.5" fill="#fbefdd" strokeWidth="1.2" />
      <text x="20" y="24.4" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="700" fill="currentColor" stroke="none">x{count}</text>
    </CategoryIcon>
  );
}

function PizzaIcon() {
  return (
    <CategoryIcon>
      <path d="M7 10.5 12.5 24.5 22.5 12" />
      <path d="M5 7.5A21 21 0 0 1 24 9l-1.5 3A18 18 0 0 0 7 10.5L5 7.5Z" />
      <circle cx="12" cy="14" r="1.4" />
      <circle cx="17.5" cy="14.5" r="1.3" />
      <path d="m13.5 19 1.5-1" />
    </CategoryIcon>
  );
}

const cards = [
  { title: "Fiambres", category: "fiambres", icon: <HamIcon />, tone: "text-[#8f1f23]" },
  { title: "Quesos y lácteos", category: "quesos", icon: <CheeseIcon />, tone: "text-[#b66d0f]" },
  { title: "Sándwich x4", category: "sandwich-x4", icon: <SandwichIcon count={4} />, tone: "text-[#8f1f23]" },
  { title: "Sándwich x8", category: "sandwich-x8", icon: <SandwichIcon count={8} />, tone: "text-[#8f1f23]" },
  { title: "Pizzas", category: "pizzas", icon: <PizzaIcon />, tone: "text-[#b66d0f]" },
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
