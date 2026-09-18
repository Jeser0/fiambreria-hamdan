"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BoxIcon, SearchIcon, WhatsAppIcon } from "./Icons";
import {
  wholesaleCategories,
  wholesaleProducts,
  type WholesaleCategoryId,
} from "@/data/wholesale";
import {
  notifyOrderUpdated,
  ORDER_BUSINESS_KEY,
  ORDER_NOTES_KEY,
  ORDER_QUANTITIES_KEY,
  ORDER_SELECTION_KEY,
  readStoredQuantities,
  readStoredSelection,
  type QuantityMap,
} from "@/lib/wholesaleOrder";

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
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [selectionLoaded, setSelectionLoaded] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    const restoredSelection = readStoredSelection();
    const restoredQuantities = readStoredQuantities();
    const restoredBusiness = window.localStorage.getItem(ORDER_BUSINESS_KEY) ?? "";
    const restoredNotes = window.localStorage.getItem(ORDER_NOTES_KEY) ?? "";

    const frame = window.requestAnimationFrame(() => {
      setSelected(restoredSelection);
      setQuantities(restoredQuantities);
      setBusinessName(restoredBusiness.slice(0, 100));
      setDetail(restoredNotes.slice(0, 800));
      setSelectionLoaded(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!selectionLoaded) return;
    window.localStorage.setItem(ORDER_SELECTION_KEY, JSON.stringify(selected));
    window.localStorage.setItem(ORDER_QUANTITIES_KEY, JSON.stringify(quantities));
    window.localStorage.setItem(ORDER_BUSINESS_KEY, businessName);
    window.localStorage.setItem(ORDER_NOTES_KEY, detail);
    notifyOrderUpdated();
  }, [businessName, detail, quantities, selected, selectionLoaded]);

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
    setSelected((current) => {
      if (current.includes(productId)) {
        setQuantities((currentQuantities) => {
          const next = { ...currentQuantities };
          delete next[productId];
          return next;
        });
        return current.filter((id) => id !== productId);
      }

      return [...current, productId];
    });
  }

  function updateQuantity(productId: string, value: string) {
    setQuantities((current) => ({ ...current, [productId]: value.slice(0, 80) }));
  }

  const selectedProducts = wholesaleProducts.filter((product) => selected.includes(product.id));
  const messageLines = [
    "Hola Hamdan, quisiera hacer una consulta mayorista.",
    businessName ? `Comercio / nombre: ${businessName}` : "",
    selectedProducts.length ? "Productos:" : "",
    ...selectedProducts.map((product) => {
      const quantity = quantities[product.id]?.trim();
      return `- ${product.name}${quantity ? ` — ${quantity}` : ""}`;
    }),
    detail ? `Detalle adicional: ${detail}` : "",
    "¿Me pueden indicar disponibilidad y precio vigente?",
  ].filter(Boolean);

  const whatsappUrl = `https://wa.me/543813514449?text=${encodeURIComponent(messageLines.join("\n"))}`;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_410px]">
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
                  <p className="text-xs font-bold text-[#9b6b2a]">Precio vigente a consultar</p>
                  <button
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-black transition ${isSelected ? "bg-[#8f1f23] text-white" : "border border-[#8f1f23]/20 bg-white text-[#7f2023] hover:bg-[#fff4e6]"}`}
                    aria-pressed={isSelected}
                  >
                    {isSelected ? "✓ Agregado" : "+ Agregar"}
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

      <aside id="consulta" className="h-fit scroll-mt-36 rounded-[2rem] border border-[#8f1f23]/12 bg-[#f7ead7] p-6 shadow-[0_16px_34px_rgba(84,48,30,0.08)] xl:sticky xl:top-32">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a66c1e]">Mi pedido mayorista</p>
        <h2 className="font-display mt-2 text-3xl font-black leading-none text-[#771e23]">Armá tu consulta</h2>
        <p className="mt-3 text-sm leading-6 text-[#715e53]">Agregá productos, indicá cantidades y enviá todo junto al WhatsApp mayorista.</p>

        <div className="mt-5 rounded-2xl border border-[#8f1f23]/10 bg-white/70 p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8f1f23]">Seleccionados: {selectedProducts.length}</p>
          {selectedProducts.length ? (
            <ul className="mt-3 space-y-3 text-sm text-[#604d44]">
              {selectedProducts.map((product) => (
                <li key={product.id} className="rounded-xl border border-[#8f1f23]/8 bg-white/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-bold">{product.name}</span>
                    <button type="button" onClick={() => toggleProduct(product.id)} className="rounded-md px-1.5 text-sm font-black text-[#9a302e] hover:bg-[#9a302e]/8" aria-label={`Quitar ${product.name}`}>×</button>
                  </div>
                  <input
                    value={quantities[product.id] ?? ""}
                    onChange={(event) => updateQuantity(product.id, event.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#8f1f23]/12 bg-[#fffaf2] px-3 py-2 text-xs outline-none transition focus:border-[#8f1f23]/40"
                    placeholder="Cantidad / presentación"
                    aria-label={`Cantidad o presentación para ${product.name}`}
                  />
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
            onChange={(event) => setBusinessName(event.target.value.slice(0, 100))}
            className="mt-2 w-full rounded-xl border border-[#8f1f23]/15 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#4f3b33] outline-none transition focus:border-[#8f1f23]/45"
            placeholder="Ej. Almacén San Martín"
          />
        </label>

        <label className="mt-4 block text-xs font-black uppercase tracking-[0.1em] text-[#70453b]">
          Detalle adicional
          <textarea
            value={detail}
            onChange={(event) => setDetail(event.target.value.slice(0, 800))}
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-[#8f1f23]/15 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#4f3b33] outline-none transition focus:border-[#8f1f23]/45"
            placeholder="Ej. marca preferida, formato, consulta especial..."
          />
        </label>

        {selectedProducts.length ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#15975d]/45 bg-[#15975d]/12 px-5 py-3.5 text-sm font-black text-[#0b7145] transition hover:-translate-y-0.5 hover:bg-[#15975d]/18 hover:shadow-md"
          >
            <WhatsAppIcon size={19} /> Enviar por WhatsApp
          </a>
        ) : (
          <div className="mt-5 rounded-xl border border-[#8f1f23]/10 bg-white/55 px-4 py-3 text-center text-xs font-bold text-[#806d62]">
            Agregá al menos un producto para enviar la consulta.
          </div>
        )}

        <Link href="/pedido" className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[#8f1f23]/18 bg-white/70 px-5 py-3 text-sm font-black text-[#7b2022] transition hover:bg-white">
          Revisar pedido completo →
        </Link>
        <p className="mt-3 text-center text-[11px] leading-4 text-[#897268]">Los precios y la disponibilidad se confirman al momento de la consulta.</p>
      </aside>
    </div>
  );
}
