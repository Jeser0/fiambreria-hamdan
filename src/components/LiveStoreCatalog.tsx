"use client";

import type { CatalogCategoryId, StoreMode } from "@/data/catalog";
import type { CatalogSnapshot } from "@/lib/catalog";
import { useCurrentCatalog } from "@/lib/useCurrentCatalog";
import StoreCatalog from "./StoreCatalog";

export default function LiveStoreCatalog({
  initialCatalog,
  ...props
}: {
  initialCatalog: CatalogSnapshot;
  mode: StoreMode;
  initialQuery?: string;
  initialCategory?: "todos" | CatalogCategoryId;
}) {
  const { snapshot, minimums, error, refresh } =
    useCurrentCatalog(initialCatalog);
  return (
    <>
      {error && (
        <p
          role="status"
          className="mb-4 rounded-xl bg-[#fff0b7] p-4 text-sm text-[#742026]"
        >
          {error}{" "}
          <button
            type="button"
            onClick={() => void refresh()}
            className="checkout-focus rounded font-bold underline"
          >
            Reintentar
          </button>
        </p>
      )}
      <StoreCatalog
        {...props}
        catalog={snapshot.products}
        categories={snapshot.categories}
        minimums={minimums}
      />
    </>
  );
}
