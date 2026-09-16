"use client";

import { useMemo, useState } from "react";
import { BoxIcon, SearchIcon, WhatsAppIcon } from "./Icons";
import {
  wholesaleCategories,
  wholesaleProducts,
  type WholesaleCategoryId,
} from "@/data/wholesale";

type CategoryFilter = "todos" | WholesaleCategoryId;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function WholesaleCatalog({
  initialQuery = "",
  initialCategory = "todos",
}: {
  initialQuery?: string;
  initialCategory?: CategoryFilter;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [selected, setSelected] = useState<string[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [detail, setDetail] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalize(query);

    return wholesaleProducts.filter((product) => {
      const matchesCategory = category === "todos" || product.category === category;
      const searchable = normalize(`${product.name} ${product.description}`);
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  function toggleProduct(productId: string) {
    setSelected((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  const selectedProducts = wholesaleProducts.filter((product) => selected.includes(product.id));
  const messageLines = [
    "Hola Hamdan, quisiera hacer una consulta mayorista.",
    businessName ? `Comercio / nombre: ${businessName}` : "",
    selectedProducts.length ? "Productos:" : "",
    ...selectedProducts.map((product) => `- ${product.name}`),
    detail ? `Detalle de cantidades / presentación: ${detail}` : "",
    "¿Me pueden indicar disponibilidad y precio vigente?",
  ].filter(Boolean);

  const whatsappUrl = `https://wa.me/543813514449?text=${encodeURIComponent(messageLines.join("\n"))}`;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div>
        <div className="rounded-3xl border border-[#7f241f]/10 bg-white/80 p-4 shadow-[0_12px_28px_rgba(84,48,30,0.06)] sm:p-5">
          <label className="flex items-center gap-3 rounded-2xl border border-[#7a221f]/15 bg-[#fffaf2] px-4 py-3 text-sm text-[#765f52]">
            <SearchIcon size={19} className="shrink-0 text-[#7c2925]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar queso, fiambre o alimento..."
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#aa998d]"
              aria-label="Buscar productos mayoristas"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2" aria-label="Filtrar por categoría">
            <button
              type="button"
              onClick={() => setCategory("todos")}
              className={`rounded-full border px-4 py-2 text-xs font-black transition ${category === "todos" ? "border-[#8f1f23] bg-[#8f1f23] text-white" : "border-[#8f1f23]/15 bg-white text-[#74433a] hover:border-[#8f1f23]/35"}`}
            >
              Todos
            </button>
            {wholesaleCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`rounded-full border px-4 py-2 text-xs font-black transition ${category === item.id ? "border-[#8f1f23] bg-[#8f1f23] text-white" : "border-[#8f1f23]/15 bg-white text-[#74433a] hover:border-[#8f1f23]/35"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {filteredProducts.map((product) => {
            const isSelected = selected.includes(product.id);
            const categoryLabel = wholesaleCategories.find((item) => item.id === product.category)?.label;

            return (
              <article
                key={product.id}
                id={product.id}
                className={`rounded-3xl border p-5 transition ${isSelected ? "border-[#8f1f23]/45 bg-[#fff8ea] shadow-[0_12px_28px_rgba(143,31,35,0.08)]" : "border-[#7f241f]/10 bg-white/80 hover:-translate-y-0.5 hover:border-[#8f1f23]/25 hover:shadow-[0_12px_24px_rgba(84,48,30,0.07)]"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f7ead4] text-[#8f1f23]">
                    <BoxIcon size={22} />
                  </div>
                  <span className="rounded-full bg-[#f7eddc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#9b6822]">
                    {categoryLabel}
                  </span>
                </div>
                <h2 className="font-display mt-5 text-2xl font-black text-[#742026]">{product.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[#725f54]">{product.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-[#9b6b2a]">Precio actualizado a consultar</p>
                  <button
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-black transition ${isSelected ? "bg-[#8f1f23] text-white" : "border border-[#8f1f23]/20 bg-white text-[#7f2023] hover:bg-[#fff4e6]"}`}
                    aria-pressed={isSelected}
                  >
                    {isSelected ? "✓ Agregado" : "+ Consultar"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-5 rounded-3xl border border-dashed border-[#8f1f23]/25 bg-white/60 px-6 py-12 text-center">
            <p className="font-display text-2xl font-black text-[#742026]">No encontramos ese producto</p>
            <p className="mt-2 text-sm text-[#725f54]">Probá con otra búsqueda o consultanos por WhatsApp; podemos revisar disponibilidad.</p>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-[2rem] border border-[#8f1f23]/12 bg-[#f7ead7] p-6 shadow-[0_16px_34px_rgba(84,48,30,0.08)] xl:sticky xl:top-32">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a66c1e]">Consulta mayorista</p>
        <h2 className="font-display mt-2 text-3xl font-black leading-none text-[#771e23]">Armá tu consulta</h2>
        <p className="mt-3 text-sm leading-6 text-[#715e53]">Seleccioná los productos que te interesan y enviá el detalle directamente al WhatsApp mayorista.</p>

        <div className="mt-5 rounded-2xl border border-[#8f1f23]/10 bg-white/70 p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8f1f23]">Seleccionados: {selectedProducts.length}</p>
          {selectedProducts.length ? (
            <ul className="mt-3 space-y-2 text-sm text-[#604d44]">
              {selectedProducts.map((product) => (
                <li key={product.id} className="flex items-start justify-between gap-3">
                  <span>• {product.name}</span>
                  <button type="button" onClick={() => toggleProduct(product.id)} className="text-xs font-black text-[#9a302e]" aria-label={`Quitar ${product.name}`}>×</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[#8a776b]">Todavía no agregaste productos.</p>
          )}
        </div>

        <label className="mt-4 block text-xs font-black uppercase tracking-[0.1em] text-[#70453b]">
          Nombre o comercio
          <input
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#8f1f23]/15 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#4f3b33] outline-none transition focus:border-[#8f1f23]/45"
            placeholder="Ej. Almacén San Martín"
          />
        </label>

        <label className="mt-4 block text-xs font-black uppercase tracking-[0.1em] text-[#70453b]">
          Cantidades o detalle
          <textarea
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-[#8f1f23]/15 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#4f3b33] outline-none transition focus:border-[#8f1f23]/45"
            placeholder="Ej. 3 hormas de Tybo, 20 paquetes de sándwiches..."
          />
        </label>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#15975d]/45 bg-[#15975d]/12 px-5 py-3.5 text-sm font-black text-[#0b7145] transition hover:-translate-y-0.5 hover:bg-[#15975d]/18 hover:shadow-md"
        >
          <WhatsAppIcon size={19} /> Enviar consulta por WhatsApp
        </a>
        <p className="mt-3 text-center text-[11px] leading-4 text-[#897268]">Los precios y la disponibilidad se confirman al momento de la consulta.</p>
      </aside>
    </div>
  );
}
