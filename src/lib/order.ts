import {
  catalogCategories,
  priceForMode,
  productsForMode,
  wholesaleMinimums,
  type CatalogCategoryId,
  type CatalogProduct,
  type StoreMode,
} from "@/data/catalog";
import type { QuantityMap } from "@/lib/storeCart";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatARS(value: number): string {
  return currencyFormatter.format(value).replace(/\u00a0/g, " ");
}

export function categoryLabel(category: CatalogCategoryId): string {
  return catalogCategories.find((item) => item.id === category)?.label ?? category;
}

export function productLabel(product: CatalogProduct): string {
  if (product.category === "pizzas") return `Pizza ${product.name}`;
  if (product.category.startsWith("sandwich-")) {
    return `${categoryLabel(product.category)} — ${product.name}`;
  }
  return product.name;
}

export function isPackagedProduct(product: CatalogProduct): boolean {
  return product.category === "pizzas" || product.category.startsWith("sandwich-");
}

// Only decimal notation is accepted: no exponents, negatives or thousands separators.
// Quantity strings remain compatible with the existing localStorage schema.
export function parseQuantity(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(?:\.\d{1,3})?$/.test(normalized)) return 0;
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 && number <= 999999 ? number : 0;
}

export type OrderLine = {
  product: CatalogProduct;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  quantityError?: string;
};

export function buildOrderLines(
  mode: StoreMode,
  selection: readonly string[],
  quantities: QuantityMap,
): OrderLine[] {
  return productsForMode(mode)
    .filter((product) => selection.includes(product.id))
    .map((product) => {
      const quantity = parseQuantity(quantities[product.id] ?? "");
      const unitPrice = priceForMode(product, mode);
      // No price fallback between stores. productsForMode already filters missing prices.
      if (unitPrice === undefined || !Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error(`Precio inválido en el catálogo ${mode}: ${product.id}`);
      }
      const quantityError = quantity === 0
        ? "Ingresá una cantidad mayor a 0 y hasta 999.999 (máximo 3 decimales)."
        : isPackagedProduct(product) && !Number.isInteger(quantity)
          ? `Ingresá ${product.category === "pizzas" ? "unidades" : "paquetes"} enteros.`
          : undefined;
      return {
        product,
        quantity,
        unitPrice,
        subtotal: quantityError ? 0 : Math.round((unitPrice * quantity + Number.EPSILON) * 100) / 100,
        quantityError,
      };
    });
}

export function calculateOrderTotal(lines: readonly OrderLine[]): number {
  // Sum cents to avoid floating point drift between displayed subtotals and total.
  return lines.reduce((total, line) => total + Math.round(line.subtotal * 100), 0) / 100;
}

export type MinimumStatus = {
  category: CatalogCategoryId;
  label: string;
  quantity: number;
  minimum: number;
  missing: number;
  unit: string;
};

export function getWholesaleMinimums(mode: StoreMode, lines: readonly OrderLine[]): MinimumStatus[] {
  if (mode !== "mayorista") return [];
  return catalogCategories.flatMap(({ id, label }) => {
    const minimum = wholesaleMinimums[id];
    const group = lines.filter((line) => line.product.category === id);
    if (!minimum || group.length === 0) return [];
    const quantity = group.reduce((sum, line) => sum + (line.quantityError ? 0 : line.quantity), 0);
    return [{ category: id, label, quantity, minimum, missing: Math.max(0, minimum - quantity), unit: id === "pizzas" ? "unidades" : "paquetes" }];
  });
}
