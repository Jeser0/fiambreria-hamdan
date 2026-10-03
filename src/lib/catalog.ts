import type { CatalogCategoryId, CatalogProduct } from "../data/catalog";
import type { Database } from "./supabase/database.types";

export type CatalogCategoryData = {
  id: CatalogCategoryId;
  label: string;
  wholesaleMinimum: number;
  sortOrder: number;
};
export type CatalogSnapshot = {
  categories: CatalogCategoryData[];
  products: CatalogProduct[];
};
export type CatalogCategories = readonly {
  id: CatalogCategoryId;
  label: string;
}[];
export type CatalogMinimums = Partial<Record<CatalogCategoryId, number>>;

const categoryIds = new Set<string>([
  "quesos",
  "fiambres",
  "sandwich-x4",
  "sandwich-x8",
  "pizzas",
]);

export function catalogMinimums(snapshot: CatalogSnapshot): CatalogMinimums {
  return Object.fromEntries(
    snapshot.categories.map((category) => [
      category.id,
      category.wholesaleMinimum,
    ]),
  );
}

export function mapCatalogSnapshot(
  categoryRows: readonly Database["public"]["Tables"]["categories"]["Row"][],
  productRows: readonly Database["public"]["Tables"]["products"]["Row"][],
): CatalogSnapshot {
  const categories = categoryRows
    .filter((row) => row.active && categoryIds.has(row.id))
    .map((row) => {
      const minimum = Number(row.wholesale_minimum);
      if (!Number.isSafeInteger(minimum) || minimum < 0)
        throw new Error("El catálogo contiene un mínimo inválido.");
      return {
        id: row.id as CatalogCategoryId,
        label: row.name,
        wholesaleMinimum: minimum,
        sortOrder: row.sort_order,
      };
    });
  const activeCategories = new Set<string>(
    categories.map((category) => category.id),
  );
  const price = (value: number | null) => {
    if (value === null) return undefined;
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || number > 999999999.99)
      throw new Error("El catálogo contiene un precio inválido.");
    return number;
  };
  const products = productRows
    .filter(
      (row) =>
        row.active && row.in_stock && activeCategories.has(row.category_id),
    )
    .map((row): CatalogProduct => {
      const retailPrice = price(row.retail_price);
      const wholesalePrice = price(row.wholesale_price);
      return {
        id: row.id,
        name: row.name,
        category: row.category_id as CatalogCategoryId,
        retailPrice,
        wholesalePrice,
        wholesaleSamePrice:
          row.wholesale_same_price &&
          retailPrice !== undefined &&
          retailPrice === wholesalePrice,
        image: row.image_url ?? undefined,
        imageAlt: row.image_alt ?? undefined,
        active: row.active,
        inStock: row.in_stock,
      };
    });
  return { categories, products };
}
