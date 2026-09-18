import { catalogProducts, type StoreMode } from "@/data/catalog";

export const STORE_CART_UPDATED_EVENT = "hamdan-store-cart-updated";

export type QuantityMap = Record<string, string>;

function prefix(mode: StoreMode) {
  return `hamdan-${mode}`;
}

export function cartSelectionKey(mode: StoreMode) {
  return `${prefix(mode)}-selection`;
}

export function cartQuantitiesKey(mode: StoreMode) {
  return `${prefix(mode)}-quantities`;
}

export function cartCustomerKey(mode: StoreMode) {
  return `${prefix(mode)}-customer`;
}

export function cartNotesKey(mode: StoreMode) {
  return `${prefix(mode)}-notes`;
}

function modeProducts(mode: StoreMode) {
  return catalogProducts.filter((product) =>
    product.active &&
    (mode === "mayorista"
      ? typeof product.wholesalePrice === "number"
      : typeof product.retailPrice === "number"),
  );
}

export function sanitizeSelection(value: unknown, mode: StoreMode): string[] {
  if (!Array.isArray(value)) return [];
  const allowed = modeProducts(mode);
  return value.filter(
    (id): id is string =>
      typeof id === "string" && allowed.some((product) => product.id === id),
  );
}

export function readStoredSelection(mode: StoreMode): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(cartSelectionKey(mode));
    return sanitizeSelection(raw ? JSON.parse(raw) : [], mode);
  } catch {
    return [];
  }
}

export function readStoredQuantities(mode: StoreMode): QuantityMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(cartQuantitiesKey(mode));
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const allowed = modeProducts(mode);
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(
          ([id, value]) =>
            allowed.some((product) => product.id === id) && typeof value === "string",
        )
        .map(([id, value]) => [id, String(value).slice(0, 40)]),
    );
  } catch {
    return {};
  }
}

export function notifyStoreCartUpdated(mode: StoreMode) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STORE_CART_UPDATED_EVENT, { detail: { mode } }));
}
