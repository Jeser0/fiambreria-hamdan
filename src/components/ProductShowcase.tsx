"use client";

import Image from "next/image";
import { useRef } from "react";
import { showcasePhotos } from "@/data/showcase";
import { SparkIcon } from "./Icons";

export default function ProductShowcase() {
  const gallery = useRef<HTMLUListElement>(null);
  function slide(direction: number) {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    gallery.current?.scrollBy({
      left: direction * gallery.current.clientWidth * 0.8,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }
  return (
    <section
      id="nuestros-productos"
      aria-labelledby="showcase-title"
      className="scroll-mt-40 border-y border-[#7f241f]/8 bg-[#fff6e6] py-12 lg:py-16"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#a26e24]">
              <SparkIcon size={15} />
              Un poquito de Hamdan
            </p>
            <h2
              id="showcase-title"
              className="font-display mt-3 text-3xl font-black text-[#7c171c] sm:text-4xl"
            >
              Sabores que nos unen
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#725d4d]">
              Conocé algunas de nuestras especialidades. Para tu mesa, tu
              reunión o tu negocio.
            </p>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => slide(-1)}
              aria-label="Ver fotos anteriores"
              aria-controls="showcase-gallery"
              className="cheese-action checkout-focus flex h-11 w-11 items-center justify-center rounded-full text-lg"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => slide(1)}
              aria-label="Ver más fotos"
              aria-controls="showcase-gallery"
              className="cheese-action checkout-focus flex h-11 w-11 items-center justify-center rounded-full text-lg"
            >
              →
            </button>
          </div>
        </div>
        <ul
          id="showcase-gallery"
          ref={gallery}
          tabIndex={0}
          aria-label="Galería de especialidades de Hamdan; deslizá para ver más"
          className="showcase-gallery checkout-focus flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-2xl pb-5 sm:gap-5"
        >
          {showcasePhotos.map((photo) => (
            <li
              key={photo.src}
              className="w-[78%] max-w-[320px] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-60px)/4)]"
            >
              <figure className="h-full overflow-hidden rounded-2xl border border-[#be9c70]/25 bg-[#fffdf7] shadow-[0_8px_22px_rgba(84,48,30,0.05)]">
                <div className="relative aspect-[4/4.5] overflow-hidden bg-[#f1e5d0]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 78vw, 320px"
                    className="object-cover transition-transform duration-300 motion-safe:hover:scale-[1.025]"
                  />
                </div>
                <figcaption className="p-5">
                  <h3 className="font-display text-2xl font-bold text-[#742026]">
                    {photo.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#7a6352]">
                    {photo.caption}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-[#886c53] sm:hidden">
          Deslizá para conocer más →
        </p>
      </div>
    </section>
  );
}
