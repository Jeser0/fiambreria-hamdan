import Image from "next/image";
import type { CatalogCategoryId } from "@/data/catalog";

function CheeseVisual() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden="true">
      <path d="M11 40 31 15l23 11-22 25-21-11Z" fill="currentColor" opacity=".18" />
      <path d="M11 40 31 15l23 11-22 25-21-11Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M31 15v36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="39" cy="28" r="3" fill="currentColor" />
      <circle cx="25" cy="36" r="2.5" fill="currentColor" />
      <circle cx="40" cy="42" r="2" fill="currentColor" />
    </svg>
  );
}

function HamVisual() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden="true">
      <path d="M14 43c-5-6-2-16 6-23 8-7 21-9 29-3 8 6 8 17 1 25-8 9-26 11-36 1Z" fill="currentColor" opacity=".17" />
      <path d="M14 43c-5-6-2-16 6-23 8-7 21-9 29-3 8 6 8 17 1 25-8 9-26 11-36 1Z" stroke="currentColor" strokeWidth="3" />
      <circle cx="42" cy="27" r="4" stroke="currentColor" strokeWidth="3" />
      <path d="m17 24-8-7m5 14-9-2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SandwichVisual() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden="true">
      <path d="M10 24 32 12l22 12-22 12-22-12Z" fill="currentColor" opacity=".16" />
      <path d="m10 24 22-12 22 12-22 12-22-12Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="m11 32 21 11 21-11M12 40l20 11 20-11" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M18 34c6 4 12 5 17 3 5-2 9-2 14 1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function PizzaVisual() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden="true">
      <path d="M13 18c13-8 29-8 38 0L32 53 13 18Z" fill="currentColor" opacity=".17" />
      <path d="M13 18c13-8 29-8 38 0L32 53 13 18Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M13 18c11 8 27 8 38 0" stroke="currentColor" strokeWidth="3" />
      <circle cx="28" cy="29" r="3" fill="currentColor" />
      <circle cx="38" cy="36" r="3" fill="currentColor" />
      <circle cx="27" cy="42" r="2.5" fill="currentColor" />
    </svg>
  );
}

function categoryVisual(category: CatalogCategoryId) {
  switch (category) {
    case "quesos":
      return <CheeseVisual />;
    case "fiambres":
      return <HamVisual />;
    case "sandwich-x4":
    case "sandwich-x8":
      return <SandwichVisual />;
    case "pizzas":
      return <PizzaVisual />;
  }
}

const categoryLabel: Record<CatalogCategoryId, string> = {
  quesos: "Quesos y lácteos",
  fiambres: "Fiambres",
  "sandwich-x4": "Sándwich x4",
  "sandwich-x8": "Sándwich x8",
  pizzas: "Pizzas",
};

export default function ProductMedia({
  name,
  category,
  image,
  imageAlt,
}: {
  name: string;
  category: CatalogCategoryId;
  image?: string;
  imageAlt?: string;
}) {
  if (image) {
    return (
      <div className="product-media relative aspect-[16/7] overflow-hidden rounded-2xl border border-[#7f241f]/10 bg-[#fff7e7]">
        <Image
          src={image}
          alt={imageAlt?.trim() || name}
          fill
          sizes="(max-width: 767px) 92vw, (max-width: 1279px) 44vw, 440px"
          className="object-contain object-center p-3"
        />
      </div>
    );
  }

  return (
    <div
      className="product-media product-media-fallback relative flex aspect-[16/7] items-center justify-between overflow-hidden rounded-2xl border border-[#d7b261]/28 px-5"
      aria-label={`${name}, ${categoryLabel[category]}`}
    >
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#94611d]">Fiambrería Hamdan</p>
        <p className="font-display mt-1 text-lg font-black text-[#69231f]">{categoryLabel[category]}</p>
      </div>
      <div className="relative z-10 text-[#9c522c]">{categoryVisual(category)}</div>
      <span className="pointer-events-none absolute -right-7 -top-8 h-24 w-24 rounded-full border border-[#b98b31]/18" />
      <span className="pointer-events-none absolute bottom-2 left-[46%] text-[#d49a24]/45">✦</span>
    </div>
  );
}
