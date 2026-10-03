"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductMedia from "./ProductMedia";
import CartSummary from "./checkout/CartSummary";
import { SearchIcon } from "./Icons";
import {
  catalogCategories,
  catalogProducts,
  priceForMode,
  productsForMode,
  wholesaleMinimums,
  type CatalogCategoryId,
  type CatalogProduct,
  type StoreMode,
} from "@/data/catalog";
import { categoryLabel, formatARS } from "@/lib/order";
import { useStoreCart } from "@/lib/useStoreCart";

type CategoryFilter = "todos" | CatalogCategoryId;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function minimumText(
  category: CatalogCategoryId,
  minimums: Partial<Record<CatalogCategoryId, number>>,
) {
  const minimum = minimums[category];

  if (!minimum) return null;

  const unit = category === "pizzas" ? "unidades" : "paquetes";

  return `Mínimo mayorista: ${minimum} ${unit} surtidos`;
}

export default function StoreCatalog({
  mode,
  initialQuery = "",
  initialCategory = "todos",
  catalog = catalogProducts,
  categories = catalogCategories,
  minimums = wholesaleMinimums,
}: {
  mode: StoreMode;
  initialQuery?: string;
  initialCategory?: CategoryFilter;
  catalog?: readonly CatalogProduct[];
  categories?: readonly {
    id: CatalogCategoryId;
    label: string;
  }[];
  minimums?: Partial<Record<CatalogCategoryId, number>>;
}) {
  const products = useMemo(
    () => productsForMode(mode, catalog),
    [mode, catalog],
  );

  const availableCategories = useMemo(
    () =>
      categories.filter((item) =>
        products.some((product) => product.category === item.id),
      ),
    [categories, products],
  );

  const [query, setQuery] = useState(initialQuery);

  const [category, setCategory] =
    useState<CategoryFilter>(initialCategory);

  const cart = useStoreCart(mode);
  const selected = cart.selected;

  const [recentlyAdded, setRecentlyAdded] =
    useState<string | null>(null);

  const [statusMessage, setStatusMessage] = useState("");

  const addFeedbackTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (addFeedbackTimer.current) {
        window.clearTimeout(addFeedbackTimer.current);
      }
    },
    [],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalize(query);

    return products.filter((product) => {
      const matchesCategory =
        category === "todos" || product.category === category;

      const matchesQuery =
        !normalizedQuery ||
        normalize(
          `${product.name} ${categoryLabel(
            product.category,
            categories,
          )}`,
        ).includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, categories, products, query]);

  const selectedProducts = useMemo(
    () =>
      products.filter((product) =>
        selected.includes(product.id),
      ),
    [products, selected],
  );

  function addOrRemove(product: CatalogProduct) {
    const removing = selected.includes(product.id);

    cart.toggleProduct(product.id);

    setStatusMessage(
      `${product.name} fue ${
        removing ? "quitado del" : "agregado al"
      } carrito.`,
    );

    if (addFeedbackTimer.current) {
      window.clearTimeout(addFeedbackTimer.current);
    }

    setRecentlyAdded(removing ? null : product.id);

    if (!removing) {
      addFeedbackTimer.current = window.setTimeout(
        () => setRecentlyAdded(null),
        1100,
      );
    }
  }

  return (
    <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_410px]">
      <p
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusMessage}
      </p>

      <div>
        <div className="rounded-3xl border border-[#7f241f]/10 bg-white/80 p-4 shadow-[0_12px_28px_rgba(84,48,30,0.06)] sm:p-5">
          <label className="field-shell flex items-center gap-3 rounded-2xl border border-[#7a221f]/15 bg-[#fffaf2] px-4 py-3 text-sm text-[#765f52]">
            <SearchIcon
              size={19}
              className="shrink-0 text-[#7c2925]"
            />

            <input
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Buscar producto..."
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#aa998d]"
              aria-label={`Buscar productos de la tienda ${mode}`}
            />
          </label>

          <div
            className="mt-4 flex flex-wrap gap-2"
            aria-label="Filtrar por categoría"
          >
            <button
              type="button"
              onClick={() => setCategory("todos")}
              className={`category-pill soft-press rounded-full border px-4 py-2 text-xs font-black transition ${
                category === "todos"
                  ? "border-[#8f1f23] bg-[#8f1f23] text-white"
                  : "border-[#8f1f23]/15 bg-white text-[#74433a] hover:border-[#8f1f23]/35"
              }`}
            >
              Todos
            </button>

            {availableCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`category-pill soft-press rounded-full border px-4 py-2 text-xs font-black transition ${
                  category === item.id
                    ? "border-[#8f1f23] bg-[#8f1f23] text-white"
                    : "border-[#8f1f23]/15 bg-white text-[#74433a] hover:border-[#8f1f23]/35"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div
          key={category}
          className="catalog-results-enter mt-5 grid gap-4 md:grid-cols-2"
        >
          {filteredProducts.map((product) => {
            const isSelected = selected.includes(product.id);

            const price = priceForMode(product, mode);

            const minText =
              mode === "mayorista"
                ? minimumText(product.category, minimums)
                : null;

            return (
              <article
                key={product.id}
                id={product.id}
                className={`product-card group rounded-3xl border p-4 sm:p-5 ${
                  isSelected
                    ? "product-card-selected border-[#8f1f23]/45 bg-[#fff8ea] shadow-[0_12px_28px_rgba(143,31,35,0.08)]"
                    : "border-[#7f241f]/10 bg-white/80"
                } ${
                  recentlyAdded === product.id
                    ? "product-card-added"
                    : ""
                }`}
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
                      {categoryLabel(
                        product.category,
                        categories,
                      )}
                    </span>

                    <h2 className="font-display mt-3 text-2xl font-black leading-tight text-[#742026]">
                      {product.name}
                    </h2>

                    {minText && (
                      <p className="mt-2 text-xs font-bold text-[#956318]">
                        {minText}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#8f1f23]/8 pt-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9b6b2a]">
                      Precio{" "}
                      {mode === "mayorista"
                        ? "mayorista"
                        : "minorista"}
                    </p>

                    <p className="font-display mt-1 text-2xl font-black text-[#4f251f]">
                      {typeof price === "number"
                        ? formatARS(price)
                        : "Consultar"}
                    </p>

                    {mode === "mayorista" &&
                      product.wholesaleSamePrice && (
                        <p className="mt-1 text-[10px] font-bold text-[#8a6b58]">
                          Mismo precio que por menor
                        </p>
                      )}
                  </div>

                  <button
                    type="button"
                    disabled={!cart.loaded}
                    onClick={() => addOrRemove(product)}
                    className={`soft-press shrink-0 rounded-xl px-3.5 py-2.5 text-xs font-black transition-all duration-200 ${
                      isSelected
                        ? "bg-[#8f1f23] text-white shadow-sm"
                        : "border border-[#8f1f23]/20 bg-white text-[#7f2023] hover:bg-[#fff4e6]"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {isSelected
                      ? "✓ Agregado"
                      : "+ Agregar"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-5 rounded-3xl border border-dashed border-[#8f1f23]/25 bg-white/60 px-6 py-12 text-center">
            <p className="font-display text-2xl font-black text-[#742026]">
              No encontramos ese producto
            </p>

            <p className="mt-2 text-sm text-[#725f54]">
              Probá con otra categoría o búsqueda.
            </p>
          </div>
        )}
      </div>

      <CartSummary mode={mode} />

      {selectedProducts.length > 0 && (
        <a
          href="#carrito"
          className="mobile-cart-dock soft-press fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-3 rounded-2xl border border-[#c49532]/40 bg-[#fff0b7]/95 px-4 py-3 shadow-[0_16px_40px_rgba(72,42,20,0.22)] backdrop-blur-md xl:hidden"
        >
          <span>
            <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#956318]">
              Mi pedido {mode}
            </span>

            <span className="font-display text-lg font-black text-[#54241f]">
              {selectedProducts.length}{" "}
              {selectedProducts.length === 1
                ? "producto"
                : "productos"}
            </span>
          </span>

          <span className="rounded-xl border border-[#b98525]/30 bg-white/65 px-4 py-2 text-xs font-black text-[#2b2118] shadow-sm">
            Ver carrito →
          </span>
        </a>
      )}
    </div>
  );
}