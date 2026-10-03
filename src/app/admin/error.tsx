"use client";

export default function AdminError({ retry }: { retry: () => void }) {
  return (
    <div role="alert" className="mt-8 rounded-2xl bg-white p-6 text-[#742026]">
      <h1 className="font-display text-2xl font-black">
        No pudimos cargar el panel
      </h1>
      <p className="mt-3 text-sm">Intentá nuevamente en unos momentos.</p>
      <button
        onClick={retry}
        className="cheese-action checkout-focus mt-5 rounded-xl px-5 py-3 font-bold"
      >
        Reintentar
      </button>
    </div>
  );
}
