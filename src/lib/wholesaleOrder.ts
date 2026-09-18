import { wholesaleProducts } from "@/data/wholesale";

export const ORDER_SELECTION_KEY = "hamdan-wholesale-selection";
export const ORDER_QUANTITIES_KEY = "hamdan-wholesale-quantities";
export const ORDER_BUSINESS_KEY = "hamdan-wholesale-business";
export const ORDER_NOTES_KEY = "hamdan-wholesale-notes";
export const ORDER_UPDATED_EVENT = "hamdan-cart-updated";

export type QuantityMap = Record<string, string>;

export function sanitizeSelection(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (id): id is string =>
      typeof id === "string" && wholesaleProducts.some((product) => product.id === id),
  );
}

export function readStoredSelection(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ORDER_SELECTION_KEY);
    return sanitizeSelection(raw ? JSON.parse(raw) : []);
  } catch {
    return [];
  }
}

export function readStoredQuantities(): QuantityMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(ORDER_QUANTITIES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([id, value]) =>
          wholesaleProducts.some((product) => product.id === id) && typeof value === "string",
        )
        .map(([id, value]) => [id, String(value).slice(0, 80)]),
    );
  } catch {
    return {};
  }
}

export function notifyOrderUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ORDER_UPDATED_EVENT));
}
