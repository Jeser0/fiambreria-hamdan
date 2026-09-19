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
  return [...new Set(value.filter(
    (id): id is string =>
      typeof id === "string" && allowed.some((product) => product.id === id),
  ))];
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

export type CartSnapshot = {
  selected: string[];
  quantities: QuantityMap;
  loaded: boolean;
  persistent: boolean;
};

const serverSnapshot: CartSnapshot = { selected: [], quantities: {}, loaded: false, persistent: true };
const snapshots: Partial<Record<StoreMode, CartSnapshot>> = {};

export function getServerCartSnapshot(): CartSnapshot {
  return serverSnapshot;
}

export function getCartSnapshot(mode: StoreMode): CartSnapshot {
  if (typeof window === "undefined") return serverSnapshot;
  if (!snapshots[mode]) {
    snapshots[mode] = {
      selected: readStoredSelection(mode),
      quantities: readStoredQuantities(mode),
      loaded: true,
      persistent: true,
    };
  }
  return snapshots[mode];
}

// A shared cached snapshot of the existing storage, never a second checkout cart.
export function subscribeToCart(mode: StoreMode, onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== cartSelectionKey(mode) && event.key !== cartQuantitiesKey(mode)) return;
    snapshots[mode] = undefined;
    onChange();
  };
  const onLocalUpdate = () => onChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener(STORE_CART_UPDATED_EVENT, onLocalUpdate);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORE_CART_UPDATED_EVENT, onLocalUpdate);
  };
}

export function updateStoreCart(
  mode: StoreMode,
  update: (cart: CartSnapshot) => Pick<CartSnapshot, "selected" | "quantities">,
): void {
  const next = update(getCartSnapshot(mode));
  const selected = sanitizeSelection(next.selected, mode);
  const quantities = Object.fromEntries(selected.map((id) => [id, next.quantities[id] ?? ""]));
  let persistent = true;
  try {
    window.localStorage.setItem(cartSelectionKey(mode), JSON.stringify(selected));
    window.localStorage.setItem(cartQuantitiesKey(mode), JSON.stringify(quantities));
  } catch {
    // Keep the shared in-memory snapshot usable when storage is unavailable/full.
    persistent = false;
  }
  snapshots[mode] = { selected, quantities, loaded: true, persistent };
  notifyStoreCartUpdated(mode);
}
