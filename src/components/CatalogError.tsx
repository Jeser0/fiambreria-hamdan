"use client";

import HamdanHeader from "./HamdanHeader";
import HamdanFooter from "./HamdanFooter";

export default function CatalogError({ retry }: { retry: () => void }) {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#382a22]">
      <HamdanHeader />
      <div role="alert" className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="font-display text-3xl font-black text-[#742026]">
          No pudimos consultar el catálogo
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#796052]">
          Intentá nuevamente en unos momentos para ver los precios y la
          disponibilidad actualizados. Tu carrito sigue guardado en este
          dispositivo.
        </p>
        <button
          type="button"
          onClick={retry}
          className="cheese-action checkout-focus mt-6 rounded-xl px-5 py-3 font-black"
        >
          Reintentar
        </button>
      </div>
      <HamdanFooter />
    </main>
  );
}
