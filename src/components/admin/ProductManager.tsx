"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { saveProduct } from "@/app/admin/actions";
import type { AdminCategory, AdminProduct } from "@/lib/admin-product";
import ProductImageEditor from "./ProductImageEditor";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function ProductEditor({
  product,
  category,
}: {
  product: AdminProduct;
  category: string;
}) {
  const [updatedAt, setUpdatedAt] = useState(product.updated_at);
  const [imageBusy, setImageBusy] = useState(false);
  const [state, action, pending] = useActionState(
    async (previous: Parameters<typeof saveProduct>[0], form: FormData) => {
      const saved = await saveProduct(previous, form);
      if (saved.ok && saved.updatedAt) setUpdatedAt(saved.updatedAt);
      return saved;
    },
    {
      ok: false,
      message: "",
    },
  );
  const [retailPrice, setRetailPrice] = useState(
    String(product.retail_price ?? ""),
  );
  const [wholesalePrice, setWholesalePrice] = useState(
    String(product.wholesale_price ?? ""),
  );
  const [active, setActive] = useState(product.active);
  const [inStock, setInStock] = useState(product.in_stock);
  return (
    <div className="rounded-3xl border border-[#8f1f23]/15 bg-white/80 p-5 shadow-sm">
      <form action={action} aria-busy={pending}>
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="updatedAt" value={updatedAt} />
        <p className="text-xs font-bold uppercase tracking-wide text-[#a5752b]">
          {category}
        </p>
        <h2 className="font-display mt-2 text-2xl font-black text-[#742026]">
          {product.name}
        </h2>
        <fieldset
          disabled={pending || imageBusy}
          className="mt-5 space-y-4 disabled:opacity-60"
        >
          <legend className="sr-only">Editar {product.name}</legend>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm font-bold text-[#663c31]">
              Precio minorista ($)
              <input
                type="text"
                inputMode="decimal"
                name="retailPrice"
                value={retailPrice}
                onChange={(event) => setRetailPrice(event.target.value)}
                maxLength={12}
                aria-label={`Precio minorista de ${product.name}`}
                className="checkout-input mt-2 w-full px-3 py-3"
              />
            </label>
            <label className="text-sm font-bold text-[#663c31]">
              Precio mayorista ($)
              <input
                type="text"
                inputMode="decimal"
                name="wholesalePrice"
                value={wholesalePrice}
                onChange={(event) => setWholesalePrice(event.target.value)}
                maxLength={12}
                aria-label={`Precio mayorista de ${product.name}`}
                className="checkout-input mt-2 w-full px-3 py-3"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-5 text-sm font-bold text-[#663c31]">
            <label className="flex min-h-10 items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={active}
                onChange={(event) => setActive(event.target.checked)}
                className="h-5 w-5 accent-[#8f1f23]"
              />
              Activo
            </label>
            <label className="flex min-h-10 items-center gap-2">
              <input
                type="checkbox"
                name="inStock"
                checked={inStock}
                onChange={(event) => setInStock(event.target.checked)}
                className="h-5 w-5 accent-[#8f1f23]"
              />
              Disponible
            </label>
          </div>
          <button
            type="submit"
            className="cheese-action checkout-focus w-full rounded-xl px-4 py-3 text-sm font-black"
          >
            {pending ? "Guardando…" : "Guardar cambios"}
          </button>
        </fieldset>
        {state.message && (
          <p
            role={state.ok ? "status" : "alert"}
            className={`mt-3 text-sm leading-6 ${state.ok ? "text-[#27734c]" : "text-[#9a302e]"}`}
          >
            {state.message}
          </p>
        )}
      </form>
      <ProductImageEditor
        product={product}
        updatedAt={updatedAt}
        disabled={pending}
        onBusy={setImageBusy}
        onSaved={setUpdatedAt}
      />
    </div>
  );
}

export default function ProductManager({
  products,
  categories,
}: {
  products: AdminProduct[];
  categories: AdminCategory[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();
  const filtered = products.filter(
    (product) =>
      (!category || product.category_id === category) &&
      normalize(product.name).includes(normalize(query)),
  );
  return (
    <>
      <p className="mb-5 max-w-3xl text-sm leading-6 text-[#796052]">
        Los precios se expresan en pesos. Dejá un precio vacío para retirar el
        producto de esa tienda. Un producto debe estar activo y disponible para
        que pueda comprarse.
      </p>
      <div className="mb-6 grid gap-4 rounded-2xl border border-[#8f1f23]/10 bg-white/80 p-5 sm:grid-cols-[1fr_1fr_auto]">
        <label className="text-sm font-bold text-[#663c31]">
          Buscar producto
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="checkout-input mt-2 w-full px-4 py-3"
            placeholder="Nombre del producto"
          />
        </label>
        <label className="text-sm font-bold text-[#663c31]">
          Categoría
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="checkout-input mt-2 w-full px-4 py-3"
          >
            <option value="">Todas</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="checkout-focus self-end rounded-xl border border-[#8f1f23]/20 px-4 py-3 text-sm font-bold text-[#8f1f23]"
        >
          Actualizar panel
        </button>
      </div>
      <p className="mb-4 text-sm text-[#796052]" role="status">
        {filtered.length} de {products.length} productos
      </p>
      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((product) => (
          <ProductEditor
            key={`${product.id}-${product.updated_at}`}
            product={product}
            category={
              categories.find((item) => item.id === product.category_id)
                ?.name ?? product.category_id
            }
          />
        ))}
      </div>
      {!filtered.length && (
        <p className="rounded-2xl border border-dashed border-[#8f1f23]/20 p-8 text-center">
          No encontramos productos con esos filtros.
        </p>
      )}
    </>
  );
}
