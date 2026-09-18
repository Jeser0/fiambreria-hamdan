import Link from "next/link";
import { BoxIcon } from "./Icons";
import ScrollReveal from "./ScrollReveal";

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

function FoodIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3v8m-3-8v5c0 2 1.3 3 3 3s3-1 3-3V3M8 11v10M16 3v18M16 3c3 2 3.5 6.3 0 9" />
    </svg>
  );
}

const cards = [
  { title: "Fiambres", href: "/mayorista?categoria=fiambres#catalogo", icon: <HamIcon />, tone: "text-[#8f1f23]" },
  { title: "Lácteos", href: "/mayorista?categoria=quesos#catalogo", icon: <CheeseIcon />, tone: "text-[#b66d0f]" },
  { title: "Alimentos", href: "/mayorista?categoria=alimentos#catalogo", icon: <FoodIcon />, tone: "text-[#8f1f23]" },
  { title: "Mayorista", href: "/mayorista", icon: <BoxIcon size={28} />, tone: "text-[#b66d0f]" },
];

export default function SectionGateways() {
  return (
    <section id="secciones" aria-label="Secciones principales" className="scroll-mt-40 border-y border-[#7f241f]/10 bg-[#fff7e9] py-6">
      <ScrollReveal className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group flex min-h-24 items-center gap-4 rounded-2xl border border-[#7d3c32]/12 bg-[#fffdf7] p-4 shadow-[0_8px_20px_rgba(78,45,26,0.05)] transition hover:-translate-y-1 hover:border-[#8f1f23]/25 hover:shadow-[0_14px_26px_rgba(78,45,26,0.11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a13a] focus-visible:ring-offset-2"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fbefdd] ${card.tone}`}>
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg font-black leading-tight text-[#762025]">{card.title}</h2>
            </div>
            <span aria-hidden="true" className="text-xl font-black text-[#8f1f23] transition group-hover:translate-x-1">›</span>
          </Link>
        ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
