"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductMedia from "./ProductMedia";
import { SearchIcon, WhatsAppIcon } from "./Icons";
import {
  catalogCategories,
  priceForMode,
  productsForMode,
  wholesaleMinimums,
  type CatalogCategoryId,
  type CatalogProduct,
  type StoreMode,
} from "@/data/catalog";
import {
  cartCustomerKey,
  cartNotesKey,
  cartQuantitiesKey,
  cartSelectionKey,
  notifyStoreCartUpdated,
  readStoredQuantities,
  readStoredSelection,
  type QuantityMap,
} from "@/lib/storeCart";

type CategoryFilter = "todos" | CatalogCategoryId;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function positiveNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function categoryLabel(id: CatalogCategoryId) {
  return catalogCategories.find((item) => item.id === id)?.label ?? id;
}

function minimumText(category: CatalogCategoryId) {
  const minimum = wholesaleMinimums[category];
  if (!minimum) return null;
  const unit = category === "pizzas" ? "unidades" : "paquetes";
  return `Mínimo mayorista: ${minimum} ${unit} surtidos`;
}

export default function StoreCatalog({
  mode,
  initialQuery = "",
  initialCategory = "todos",
}: {
  mode: StoreMode;
  initialQuery?: string;
  initialCategory?: CategoryFilter;
}) {
  const products = useMemo(() => productsForMode(mode), [mode]);
  const availableCategories = useMemo(
    () => catalogCategories.filter((item) => products.some((product) => product.category === item.id)),
    [products],
  );

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [selected, setSelected] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [loaded, setLoaded] = useState(false);
  const [customer, setCustomer] = useState("");
  const [notes, setNotes] = useState("");
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const addFeedbackTimer = useRef<number | null>(null);

  useEffect(() => {
    const selection = readStoredSelection(mode);
    const restoredQuantities = readStoredQuantities(mode);
    const restoredCustomer = window.localStorage.getItem(cartCustomerKey(mode)) ?? "";
    const restoredNotes = window.localStorage.getItem(cartNotesKey(mode)) ?? "";

    const frame = window.requestAnimationFrame(() => {
      setSelected(selection);
      setQuantities(restoredQuantities);
      setCustomer(restoredCustomer.slice(0, 100));
      setNotes(restoredNotes.slice(0, 800));
      setLoaded(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [mode]);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(cartSelectionKey(mode), JSON.stringify(selected));
    window.localStorage.setItem(cartQuantitiesKey(mode), JSON.stringify(quantities));
    window.localStorage.setItem(cartCustomerKey(mode), customer);
    window.localStorage.setItem(cartNotesKey(mode), notes);
    notifyStoreCartUpdated(mode);
  }, [customer, loaded, mode, notes, quantities, selected]);

  useEffect(
    () => () => {
      if (addFeedbackTimer.current) window.clearTimeout(addFeedbackTimer.current);
    },
    [],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalize(query);
    return products.filter((product) => {
      const matchesCategory = category === "todos" || product.category === category;
      const matchesQuery =
        !normalizedQuery || normalize(`${product.name} ${categoryLabel(product.category)}`).includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, products, query]);

  const selectedProducts = useMemo(
    () => products.filter((product) => selected.includes(product.id)),
    [products, selected],
  );

  function addOrRemove(product: CatalogProduct) {
    setSelected((current) => {
      if (current.includes(product.id)) {
        setQuantities((currentQuantities) => {
          const next = { ...currentQuantities };
          delete next[product.id];
          return next;
        });
        setRecentlyAdded(null);
        setStatusMessage(`${product.name} fue quitado del carrito.`);
        return current.filter((id) => id !== product.id);
      }

      if (addFeedbackTimer.current) window.clearTimeout(addFeedbackTimer.current);
      setRecentlyAdded(product.id);
      setStatusMessage(`${product.name} fue agregado al carrito.`);
      addFeedbackTimer.current = window.setTimeout(() => setRecentlyAdded(null), 1100);

      setQuantities((currentQuantities) => ({
        ...currentQuantities,
        [product.id]: currentQuantities[product.id] || "1",
      }));

      return [...current, product.id];
    });
  }

  function updateQuantity(productId: string, value: string) {
    const cleaned = value.replace(/[^0-9.,]/g, "").slice(0, 12);
    setQuantities((current) => ({ ...current, [productId]: cleaned }));
  }

  function clearCart() {
    setSelected([]);
    setQuantities({});
    setStatusMessage("El carrito quedó vacío.");
  }

  const groupTotals = useMemo(() => {
    const totals: Partial<Record<CatalogCategoryId, number>> = {};
    for (const product of selectedProducts) {
      const quantity = positiveNumber(quantities[product.id] ?? "");
      totals[product.category] = (totals[product.category] ?? 0) + quantity;
    }
    return totals;
  }, [quantities, selectedProducts]);

  const quantityIssues = useMemo(
    () =>
      selectedProducts
        .filter((product) => positiveNumber(quantities[product.id] ?? "") <= 0)
        .map((product) => `Indicá una cantidad válida para ${product.name}.`),
    [quantities, selectedProducts],
  );

  const minimumIssues = useMemo(() => {
    if (mode !== "mayorista") return [] as string[];

    const categoriesSelected = new Set(selectedProducts.map((product) => product.category));
    return catalogCategories.flatMap((item) => {
      if (!categoriesSelected.has(item.id)) return [];
      const minimum = wholesaleMinimums[item.id];
      if (!minimum) return [];
      const total = groupTotals[item.id] ?? 0;
      if (total >= minimum) return [];
      const unit = item.id === "pizzas" ? "unidades" : "paquetes";
      return [`${item.label}: faltan ${Math.max(0, minimum - total)} ${unit} para llegar al mínimo de ${minimum}.`];
    });
  }, [groupTotals, mode, selectedProducts]);

  const canSend = loaded && selectedProducts.length > 0 && minimumIssues.length === 0 && quantityIssues.length === 0;

  const messageLines = [
    mode === "mayorista"
      ? "Hola Hamdan, quisiera realizar un pedido mayorista."
      : "Hola Hamdan, quisiera realizar un pedido minorista.",
    customer ? `${mode === "mayorista" ? "Nombre / comercio" : "Nombre"}: ${customer}` : "",
    selectedProducts.length ? "Productos:" : "",
    ...selectedProducts.map((product) => {
      const price = priceForMode(product, mode);
      const quantity = quantities[product.id]?.trim();
      const label = categoryLabel(product.category);
      return `- ${label} — ${product.name}${quantity ? ` — Cantidad: ${quantity}` : ""}${typeof price === "number" ? ` — ${formatARS(price)}` : ""}`;
    }),
    notes ? `Observaciones: ${notes}` : "",
    mode === "mayorista"
      ? "Quedo atento/a a la confirmación de stock y del pedido."
      : "Quedo atento/a a la confirmación del pedido.",
  ].filter(Boolean);

  const whatsappUrl = `https://wa.me/543813514449?text=${encodeURIComponent(messageLines.join("\n"))}`;

  return (
    <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_410px]">
      <p className="sr-only" aria-live="polite" aria-atomic="true">{statusMessage}</p>

      <div>
        <div className="rounded-3xl border border-[#7f241f]/10 bg-white/80 p-4 shadow-[0_12px_28px_rgba(84,48,30,0.06)] sm:p-5">
          <label className="field-shell flex items-center gap-3 rounded-2xl border border-[#7a221f]/15 bg-[#fffaf2] px-4 py-3 text-sm text-[#765f52]">
            <SearchIcon size={19} className="shrink-0 text-[#7c2925]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar producto..."
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#aa998d]"
              aria-label={`Buscar productos de la tienda ${mode}`}
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2" aria-label="Filtrar por categoría">
            <button
              type="button"
              onClick={() => setCategory("todos")}
              className={`category-pill soft-press rounded-full border px-4 py-2 text-xs font-black transition ${category === "todos" ? "border-[#8f1f23] bg-[#8f1f23] text-white" : "border-[#8f1f23]/15 bg-white text-[#74433a] hover:border-[#8f1f23]/35"}`}
            >
              Todos
            </button>
            {availableCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`category-pill soft-press rounded-full border px-4 py-2 text-xs font-black transition ${category === item.id ? "border-[#8f1f23] bg-[#8f1f23] text-white" : "border-[#8f1f23]/15 bg-white text-[#74433a] hover:border-[#8f1f23]/35"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div key={category} className="catalog-results-enter mt-5 grid gap-4 md:grid-cols-2">
          {filteredProducts.map((product) => {
            const isSelected = selected.includes(product.id);
            const price = priceForMode(product, mode);
            const minText = mode === "mayorista" ? minimumText(product.category) : null;

            return (
              <article
                key={product.id}
                id={product.id}
                className={`product-card group rounded-3xl border p-4 sm:p-5 ${isSelected ? "product-card-selected border-[#8f1f23]/45 bg-[#fff8ea] shadow-[0_12px_28px_rgba(143,31,35,0.08)]" : "border-[#7f241f]/10 bg-white/80"} ${recentlyAdded === product.id ? "product-card-added" : ""}`}
              >
                <ProductMedia
                  name={product.name}
                  category={product.category}
                  image={product.image}
                  imageAlt={product.imageAlt}
                />

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-[#f7eddc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#9b6822]">
                      {categoryLabel(product.category)}
                    </span>
                    <h2 className="font-display mt-3 text-2xl font-black leading-tight text-[#742026]">{product.name}</h2>
                    {minText && <p className="mt-2 text-xs font-bold text-[#956318]">{minText}</p>}
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#8f1f23]/8 pt-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9b6b2a]">
                      Precio {mode === "mayorista" ? "mayorista" : "minorista"}
                    </p>
                    <p className="font-display mt-1 text-2xl font-black text-[#4f251f]">
                      {typeof price === "number" ? formatARS(price) : "Consultar"}
                    </p>
                    {mode === "mayorista" && product.wholesaleSamePrice && (
                      <p className="mt-1 text-[10px] font-bold text-[#8a6b58]">Mismo precio que por menor</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => addOrRemove(product)}
                    className={`soft-press shrink-0 rounded-xl px-3.5 py-2.5 text-xs font-black transition-all duration-200 ${isSelected ? "bg-[#8f1f23] text-white shadow-sm" : "border border-[#8f1f23]/20 bg-white text-[#7f2023] hover:bg-[#fff4e6]"}`}
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
            <p className="mt-2 text-sm text-[#725f54]">Probá con otra categoría o búsqueda.</p>
          </div>
        )}
      </div>

      <aside
        id="carrito"
        className="h-fit scroll-mt-36 rounded-[2rem] border border-[#d6ae55]/40 bg-[#fff0b7]/70 p-5 shadow-[0_16px_34px_rgba(84,48,30,0.08)] sm:p-6 xl:sticky xl:top-32"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9f6817]">Mi pedido {mode}</p>
            <h2 className="font-display mt-2 text-3xl font-black leading-none text-[#5f271f]">Tu carrito</h2>
          </div>
          {selectedProducts.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="rounded-lg px-2 py-1 text-[11px] font-black text-[#8f1f23] underline decoration-[#8f1f23]/25 underline-offset-4 hover:decoration-[#8f1f23]"
            >
              Vaciar
            </button>
          )}
        </div>
        <p className="mt-3 text-sm leading-6 text-[#715e53]">Agregá productos sin salir de la tienda. Tu selección queda guardada en este dispositivo.</p>

        <div className="mt-5 rounded-2xl border border-[#8f1f23]/10 bg-white/65 p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8f1f23]">Productos: {selectedProducts.length}</p>
          {selectedProducts.length ? (
            <ul className="mt-3 max-h-[420px] space-y-3 overflow-auto pr-1 text-sm text-[#604d44]">
              {selectedProducts.map((product) => {
                const price = priceForMode(product, mode);
                const minControlled = mode === "mayorista" && Boolean(wholesaleMinimums[product.category]);
                return (
                  <li
                    key={product.id}
                    className={`rounded-xl border border-[#8f1f23]/8 bg-white/75 p-3 ${recentlyAdded === product.id ? "order-summary-item-enter" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-bold">{product.name}</span>
                        <p className="mt-1 text-[11px] text-[#8b6a58]">{categoryLabel(product.category)} · {typeof price === "number" ? formatARS(price) : "Consultar"}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addOrRemove(product)}
                        className="rounded-md px-1.5 text-sm font-black text-[#9a302e] hover:bg-[#9a302e]/8"
                        aria-label={`Quitar ${product.name}`}
                      >
                        ×
                      </button>
                    </div>
                    <label className="mt-2 block text-[10px] font-black uppercase tracking-[0.1em] text-[#8c6856]">
                      Cantidad{minControlled ? " para el mínimo" : ""}
                      <input
                        inputMode="decimal"
                        value={quantities[product.id] ?? ""}
                        onChange={(event) => updateQuantity(product.id, event.target.value)}
                        className="warm-field mt-1.5 w-full rounded-lg border border-[#8f1f23]/12 bg-[#fffaf2] px-3 py-2 text-xs font-normal normal-case tracking-normal outline-none transition"
                        placeholder="Ej. 2"
                        aria-label={`Cantidad para ${product.name}`}
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[#8a776b]">Todavía no agregaste productos.</p>
          )}
        </div>

        {mode === "mayorista" && selectedProducts.length > 0 && (
          <div className="mt-4 rounded-2xl border border-[#b98525]/20 bg-[#fff8dc] p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8e611c]">Mínimos del pedido</p>
            <div className="mt-2 space-y-2 text-xs leading-5 text-[#6b5548]">
              {(["sandwich-x4", "sandwich-x8", "pizzas"] as CatalogCategoryId[]).map((group) => {
                const hasGroup = selectedProducts.some((product) => product.category === group);
                if (!hasGroup) return null;
                const minimum = wholesaleMinimums[group] ?? 0;
                const total = groupTotals[group] ?? 0;
                return (
                  <p key={group} className={total >= minimum ? "font-bold text-[#27734c]" : "font-bold text-[#9a302e]"}>
                    {categoryLabel(group)}: {total}/{minimum} {group === "pizzas" ? "unidades" : "paquetes"} {total >= minimum ? "✓" : ""}
                  </p>
                );
              })}
              {!selectedProducts.some((product) => wholesaleMinimums[product.category]) && (
                <p>Quesos y fiambres no tienen un mínimo automático configurado.</p>
              )}
            </div>
          </div>
        )}

        <label className="mt-4 block text-xs font-black uppercase tracking-[0.1em] text-[#70453b]">
          {mode === "mayorista" ? "Nombre o comercio" : "Nombre"}
          <input
            value={customer}
            onChange={(event) => setCustomer(event.target.value.slice(0, 100))}
            className="warm-field mt-2 w-full rounded-xl border border-[#8f1f23]/15 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#4f3b33] outline-none transition"
            placeholder={mode === "mayorista" ? "Ej. Almacén San Martín" : "Tu nombre"}
          />
        </label>

        <label className="mt-4 block text-xs font-black uppercase tracking-[0.1em] text-[#70453b]">
          Observaciones
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value.slice(0, 800))}
            rows={3}
            className="warm-field mt-2 w-full resize-none rounded-xl border border-[#8f1f23]/15 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#4f3b33] outline-none transition"
            placeholder="Detalle adicional del pedido..."
          />
        </label>

        {(quantityIssues.length > 0 || minimumIssues.length > 0) && (
          <div className="mt-4 rounded-xl border border-[#b54843]/20 bg-[#fff4ee] px-4 py-3 text-xs leading-5 text-[#8a332f]">
            <p className="font-black">Antes de enviar:</p>
            <ul className="mt-1 list-disc pl-4">
              {[...quantityIssues, ...minimumIssues].map((issue) => <li key={issue}>{issue}</li>)}
            </ul>
          </div>
        )}

        {canSend ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="soft-press mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#15975d]/45 bg-[#15975d]/12 px-5 py-3.5 text-sm font-black text-[#0b7145] transition hover:-translate-y-0.5 hover:bg-[#15975d]/18 hover:shadow-md"
          >
            <WhatsAppIcon size={19} /> Enviar pedido por WhatsApp
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="cheese-action mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black opacity-60"
          >
            <WhatsAppIcon size={19} /> {selectedProducts.length ? "Completá el pedido para enviar" : "Agregá productos para comprar"}
          </button>
        )}

        <p className="mt-3 text-center text-[11px] leading-4 text-[#897268]">
          {mode === "mayorista"
            ? "Los pedidos mayoristas se validan según mínimos publicados y disponibilidad de stock."
            : "Los precios corresponden a la lista minorista provista por Hamdan."}
        </p>
      </aside>

      {selectedProducts.length > 0 && (
        <a
          href="#carrito"
          className="mobile-cart-dock soft-press fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-3 rounded-2xl border border-[#c49532]/40 bg-[#fff0b7]/95 px-4 py-3 shadow-[0_16px_40px_rgba(72,42,20,0.22)] backdrop-blur-md xl:hidden"
        >
          <span>
            <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#956318]">Mi pedido {mode}</span>
            <span className="font-display text-lg font-black text-[#54241f]">{selectedProducts.length} {selectedProducts.length === 1 ? "producto" : "productos"}</span>
          </span>
          <span className="rounded-xl border border-[#b98525]/30 bg-white/65 px-4 py-2 text-xs font-black text-[#2b2118] shadow-sm">Ver carrito →</span>
        </a>
      )}
    </div>
  );
}
