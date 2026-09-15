import Image from "next/image";
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
            <a href="#secciones" className="magic-button inline-flex items-center gap-2 rounded-xl bg-[#8e1e24] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#76171c] hover:shadow-lg">
              <StoreIcon size={18} /> Explorar secciones <span aria-hidden>→</span>
            </a>
            <a href="#como-pedir" className="inline-flex items-center gap-2 rounded-xl bg-[#f5c95c] px-5 py-3 text-sm font-black text-[#3f2d1f] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f7d475] hover:shadow-lg">
              <BasketIcon size={18} /> Comprar online <span aria-hidden>→</span>
            </a>
            <a href="#mayorista" className="inline-flex items-center gap-2 rounded-xl border border-[#8e1e24]/30 bg-[#fffaf0]/70 px-5 py-3 text-sm font-black text-[#7a2022] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
              <BoxIcon size={18} /> Pedidos por mayor <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[410px] items-end justify-center self-end lg:max-w-[460px]">
          <div className="absolute left-0 top-12 -rotate-3 rounded-md bg-[#f3dfba] px-4 py-3 shadow-md">
            <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-[#8d6b37]">Desde</p>
            <p className="font-display text-center text-3xl font-black text-[#7b221f]">1992</p>
            <p className="handwritten mt-1 max-w-28 text-center text-sm text-[#4f392e]">Tradición, calidad y sabor tucumano</p>
          </div>

          <p className="handwritten absolute -top-1 right-0 rotate-[-4deg] text-center text-xl font-bold text-[#8f2024] sm:text-2xl">
            Más de 30 años<br />junto a vos ♥
          </p>

          <div className="speech-bubble absolute right-0 top-20 z-10 hidden max-w-32 rotate-3 rounded-[45%] border-2 border-[#8e1e24] bg-[#fffdf6] px-4 py-3 text-center sm:block">
            <p className="handwritten text-lg font-bold leading-5 text-[#8e1e24]">¡Te ayudo a comprar!</p>
          </div>

          <Image
            src="/brand/hamdini.svg"
            alt="Hamdini, mascota de Fiambrería Hamdan"
            width={700}
            height={700}
            className="relative z-[1] mt-14 w-[85%] drop-shadow-[0_22px_18px_rgba(90,45,20,0.15)]"
            priority
          />

          <div className="absolute bottom-3 right-2 z-10 flex items-center gap-1 text-[#c68825]">
            <SparkIcon size={20} />
            <SparkIcon size={13} className="-translate-y-5" />
          </div>
          <p className="handwritten absolute bottom-2 right-8 z-10 rotate-[-5deg] text-lg font-bold text-[#8e1e24]">Hamdini siempre con vos ♥</p>
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
