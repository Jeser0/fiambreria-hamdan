import Link from "next/link";
import { BasketIcon, BoxIcon, SparkIcon } from "./Icons";

export default function OrderExperience() {
  return (
    <section id="mayorista" className="scroll-mt-40 bg-[#fff7e8] py-14 lg:py-16">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="wood-card relative overflow-hidden rounded-[2rem] p-7 text-[#fff7e5] shadow-[0_20px_45px_rgba(82,29,23,0.16)] sm:p-9">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#f5ca63]/20" />
          <div className="absolute right-12 top-12 text-[#f6c65a]/70"><SparkIcon size={24} /></div>
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f2c86c]">Hamdan Distribuciones</p>
            <h2 className="font-display mt-3 text-4xl font-black leading-none sm:text-5xl">Tienda mayorista</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#f8e7cf]/80 sm:text-base">
              Para comercios, despensas, kioscos, reventa y gastronomía. Precios por mayor y mínimos automáticos para sándwiches y pizzas.
            </p>
            <Link href="/mayorista" className="cheese-action soft-press mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black">
              <BoxIcon size={18} /> Entrar a Mayorista
            </Link>
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-[2rem] border border-[#d6ae55]/35 bg-[#fff0b7] p-7 text-[#251b12] shadow-[0_20px_45px_rgba(130,91,24,0.12)] sm:p-8">
          <SparkIcon size={18} className="absolute right-8 top-7 text-[#b77a12]" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9f6817]">Compra para tu mesa</p>
              <h2 className="font-display mt-2 text-3xl font-black leading-none text-[#59251f]">Tienda minorista</h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/55 text-[#251b12] shadow-inner"><BasketIcon size={28} /></div>
          </div>
          <p className="mt-5 text-sm leading-7 text-[#68574e]">Precios por menor separados del catálogo mayorista, sin mínimos de compra mayorista y con carrito propio.</p>
          <Link href="/minorista" className="cheese-action soft-press mt-7 inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-black">
            Entrar a Minorista →
          </Link>
        </aside>
      </div>
    </section>
  );
}
