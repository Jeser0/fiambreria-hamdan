import "server-only";
import { createClient } from "@/lib/supabase/server";
import { mapCatalogSnapshot, type CatalogSnapshot } from "./catalog";

export type { CatalogSnapshot, CatalogCategoryData } from "./catalog";

// Never cache commercial data or silently replace it with the historical price list.
export async function getCatalogSnapshot(): Promise<CatalogSnapshot> {
  const supabase = await createClient();
  const [categories, products] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("sort_order")
      .order("id"),
    supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .eq("in_stock", true)
      .order("sort_order")
      .order("id"),
  ]);
  if (categories.error || products.error) {
    console.error(
      "Catalog query failed",
      categories.error?.code ?? products.error?.code,
    );
    throw new Error(
      "No pudimos consultar el catálogo. Intentá nuevamente en unos momentos.",
    );
  }
  return mapCatalogSnapshot(categories.data ?? [], products.data ?? []);
}
