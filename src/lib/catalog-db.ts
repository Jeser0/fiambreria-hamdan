import type {
  CatalogCategoryId,
  CatalogProduct,
} from "@/data/catalog";
import { createClient } from "@/lib/supabase/server";

type CategoryRow = {
  id: string;
  name: string;
  wholesale_minimum: number;
  sort_order: number;
  active: boolean;
};

type ProductRow = {
  id: string;
  category_id: string;
  name: string;
  retail_price: number | null;
  wholesale_price: number | null;
  wholesale_same_price: boolean;
  image_url: string | null;
  image_alt: string | null;
  active: boolean;
  in_stock: boolean;
  sort_order: number;
};

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

const validCategories = new Set<CatalogCategoryId>([
  "quesos",
  "fiambres",
  "sandwich-x4",
  "sandwich-x8",
  "pizzas",
]);

function isCatalogCategoryId(value: string): value is CatalogCategoryId {
  return validCategories.has(value as CatalogCategoryId);
}

export async function getCatalogSnapshot(): Promise<CatalogSnapshot> {
  const supabase = await createClient();

  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("sort_order"),

    supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order"),
  ]);

  if (categoriesResult.error) {
    throw new Error(
      `No se pudieron cargar las categorías: ${categoriesResult.error.message}`,
    );
  }

  if (productsResult.error) {
    throw new Error(
      `No se pudieron cargar los productos: ${productsResult.error.message}`,
    );
  }

  const categoryRows =
    (categoriesResult.data ?? []) as unknown as CategoryRow[];

  const productRows =
    (productsResult.data ?? []) as unknown as ProductRow[];

  const categories: CatalogCategoryData[] = categoryRows
    .filter((category) => isCatalogCategoryId(category.id))
    .map((category) => ({
      id: category.id as CatalogCategoryId,
      label: category.name,
      wholesaleMinimum: Number(category.wholesale_minimum ?? 0),
      sortOrder: Number(category.sort_order ?? 0),
    }));

  const products: CatalogProduct[] = productRows
    .filter((product) => isCatalogCategoryId(product.category_id))
    .map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category_id as CatalogCategoryId,
      retailPrice:
        product.retail_price === null
          ? undefined
          : Number(product.retail_price),
      wholesalePrice:
        product.wholesale_price === null
          ? undefined
          : Number(product.wholesale_price),
      wholesaleSamePrice: Boolean(product.wholesale_same_price),
      image: product.image_url ?? undefined,
      imageAlt: product.image_alt ?? undefined,
      active: Boolean(product.active),
    }));

  return {
    categories,
    products,
  };
}
