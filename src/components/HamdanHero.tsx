import Image from "next/image";
import Link from "next/link";
import HamdiniAnimator from "./HamdiniAnimator";
import { BasketIcon, PinIcon, SparkIcon, StoreIcon } from "./Icons";
import { business } from "@/data/business";

export default function HamdanHero() {
  return (
    <section
      id="inicio"
      className="paper-surface relative overflow-hidden border-b border-[#7f241f]/10"
    >
      <div className="home-hero relative mx-auto max-w-[1500px]">
        <div
          id="historia"
          className="hero-copy relative z-10 scroll-mt-40 px-5 pb-7 pt-9 sm:px-6 lg:py-14 lg:pl-8"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4aa5e]/35 bg-[#fff8e6] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a6521]">
            <SparkIcon size={14} /> Tradición tucumana
          </div>
          <h1 className="font-display max-w-xl text-4xl font-black leading-[1.02] tracking-tight text-[#7c171c] sm:text-5xl lg:text-[3.7rem]">
            Bienvenidos a Fiambrería Hamdan
          </h1>
          <div className="mt-5 flex items-center gap-3 text-[#a46d1c]">
            <span className="h-px w-10 bg-[#d8a94d]" />
            <p className="font-display text-xl font-black tracking-[0.08em]">
              DESDE {business.since}
            </p>
            <span className="h-px w-10 bg-[#d8a94d]" />
          </div>
          <p className="mt-5 max-w-lg text-[15px] leading-7 text-[#58463d]">
            Una fiambrería familiar en el corazón de Tucumán. Fiambres, quesos,
            lácteos, sánguchitos y pizzas, con la misma cercanía de siempre.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/mayorista"
              className="cheese-action checkout-focus soft-press inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black"
            >
              <BasketIcon size={18} />
              Ver catálogo mayorista <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/minorista"
              className="checkout-focus soft-press inline-flex items-center justify-center gap-2 rounded-xl border border-[#8f1f23]/25 bg-[#fffaf0]/90 px-5 py-3.5 text-sm font-black text-[#7c171c] transition hover:bg-[#fff0d7]"
            >
              Comprar por menor <span aria-hidden="true">→</span>
            </Link>
            <a
              href="#secciones"
              className="checkout-focus inline-flex items-center gap-2 rounded-lg px-1 py-2 text-sm font-bold text-[#795329]"
            >
              <StoreIcon size={17} />
              Explorar secciones <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="hero-scene">
          <Image
            src="/brand/storefront.webp"
            alt="Entrada y fachada de Fiambrería Hamdan en Av. Colón 340, San Miguel de Tucumán"
            fill
            sizes="(min-width: 1500px) 1260px, (min-width: 1024px) 84vw, 100vw"
            preload
            className="object-cover"
          />
          <div
            className="hero-scene-shade pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          <div className="hero-hamdini absolute z-10">
            <HamdiniAnimator sizes="(min-width: 1500px) 315px, (min-width: 1024px) 21vw, 38vw" />
          </div>
          <div className="absolute bottom-3 right-4 z-10 hidden items-center gap-2 rounded-full border border-[#d8b778]/50 bg-[#fffaf0]/95 px-4 py-2 text-xs font-bold text-[#6c3b2e] shadow-sm sm:flex lg:bottom-6 lg:right-[8%]">
            <PinIcon size={15} />
            {business.address} · Tucumán
          </div>
        </div>
        <p className="handwritten relative z-10 px-5 py-4 text-center text-base font-bold text-[#8f2024] lg:absolute lg:bottom-5 lg:right-7 lg:py-0">
          Más de 30 años junto a vos ♥
        </p>
      </div>
    </section>
  );
}
