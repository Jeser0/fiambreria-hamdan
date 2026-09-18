import Image from "next/image";
import HamdiniAnimator from "./HamdiniAnimator";
import { BasketIcon, BoxIcon, SparkIcon, StoreIcon } from "./Icons";

export default function HamdanHero() {
  return (
    <section id="inicio" className="paper-surface hero-magic relative overflow-hidden border-b border-[#7f241f]/10">
      <div className="pointer-events-none absolute -left-8 top-40 hidden h-40 w-40 rounded-full bg-[#f2b74b]/10 blur-3xl lg:block" />
      <div className="pointer-events-none absolute right-10 top-16 hidden h-48 w-48 rounded-full bg-[#d57279]/10 blur-3xl lg:block" />

      <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.75fr_1fr] lg:items-center lg:px-8 lg:py-14">
        <div id="historia" className="scroll-mt-40">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4aa5e]/35 bg-[#fff8e6] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a6521]">
            <SparkIcon size={14} /> Tradición tucumana
          </div>

          <h1 className="font-display max-w-2xl text-4xl font-black leading-[0.96] tracking-tight text-[#7c171c] sm:text-5xl lg:text-[4.1rem]">
            Bienvenidos a Fiambrería Hamdan
          </h1>

          <div className="mt-4 flex items-center gap-3 text-[#a46d1c]">
            <span className="h-px w-12 bg-[#d8a94d]" />
            <p className="font-display text-2xl font-black tracking-[0.08em]">DESDE 1992</p>
            <span className="h-px w-12 bg-[#d8a94d]" />
          </div>

          <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#58463d] sm:text-base">
            Una fiambrería familiar en el corazón de Tucumán. Fiambres, quesos, lácteos, alimentos, sánguchitos, pizzas y atención mayorista, con la misma cercanía de siempre.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#secciones" className="magic-button inline-flex items-center gap-2 rounded-xl border border-[#d2ad59]/70 bg-[#fff5d8] px-5 py-3 text-sm font-black text-[#21180f] shadow-[0_8px_20px_rgba(145,103,31,0.12)] transition hover:-translate-y-0.5 hover:border-[#c6932f] hover:bg-[#ffe9a8] hover:shadow-[0_12px_24px_rgba(145,103,31,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a13a] focus-visible:ring-offset-2">
              <StoreIcon size={18} /> Explorar secciones <span aria-hidden>→</span>
            </a>
            <a href="/mayorista" className="inline-flex items-center gap-2 rounded-xl bg-[#f5c95c] px-5 py-3 text-sm font-black text-[#3f2d1f] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f7d475] hover:shadow-lg">
              <BasketIcon size={18} /> Ver catálogo mayorista <span aria-hidden>→</span>
            </a>
            <a href="#mayorista" className="inline-flex items-center gap-2 rounded-xl border border-[#8e1e24]/30 bg-[#fffaf0]/70 px-5 py-3 text-sm font-black text-[#7a2022] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
              <BoxIcon size={18} /> Pedidos por mayor <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[410px] items-end justify-center self-end lg:max-w-[460px]">
          <p className="handwritten absolute -top-1 right-0 z-20 rotate-[-4deg] text-center text-xl font-bold text-[#8f2024] sm:text-2xl">
            Más de 30 años<br />junto a vos ♥
          </p>

          <div className="speech-bubble absolute right-0 top-20 z-20 hidden max-w-32 rotate-3 rounded-[45%] border-2 border-[#8e1e24] bg-[#fffdf6]/95 px-4 py-3 text-center shadow-sm sm:block">
            <p className="handwritten text-lg font-bold leading-5 text-[#8e1e24]">¡Te ayudo a comprar!</p>
          </div>

          <div className="hamdini-enter relative mt-12 w-full">
            <div className="relative mx-auto w-[92%] drop-shadow-[0_22px_18px_rgba(90,45,20,0.16)]">
              <HamdiniAnimator />
            </div>
          </div>

          <p className="handwritten absolute bottom-1 right-7 z-10 rotate-[-4deg] text-lg font-bold text-[#8e1e24]">Hamdini siempre con vos ♥</p>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:mx-0">
          <div className="polaroid rotate-[1deg] bg-[#fffdf7] p-3 shadow-[0_18px_35px_rgba(77,43,24,0.16)]">
            <Image
              src="/brand/storefront.svg"
              alt="Fachada de Fiambrería Hamdan en San Miguel de Tucumán"
              width={999}
              height={423}
              className="aspect-[2.15/1] w-full object-cover"
              priority
            />
            <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
              <p className="handwritten text-base font-bold text-[#7f2724]">Nuestra casa en Tucumán ♥</p>
              <span className="rounded-full bg-[#f4e2b9] px-3 py-1 text-xs font-extrabold text-[#7e5524]">Av. Colón 340</span>
            </div>
          </div>

          <div className="absolute -right-3 -top-6 hidden rotate-6 bg-[#f3df9f] px-4 py-5 shadow-lg sm:block">
            <p className="handwritten text-center text-base font-bold leading-5 text-[#5d3a25]">Sabores<br />que unen<br />personas ♥</p>
          </div>
        </div>
      </div>
    </section>
  );
}
