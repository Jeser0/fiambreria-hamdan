import {
  catalogProducts,
  productsForMode,
  type CatalogProduct,
  type StoreMode,
} from "../data/catalog";

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

export function sanitizeSelection(
  value: unknown,
  mode: StoreMode,
  catalog: readonly CatalogProduct[] = catalogProducts,
): string[] {
  if (!Array.isArray(value)) return [];
  const allowed = productsForMode(mode, catalog);
  return [
    ...new Set(
      value.filter(
        (id): id is string =>
          typeof id === "string" &&
          allowed.some((product) => product.id === id),
      ),
    ),
  ];
}

// Persistence stores identity and quantity only. Catalog validation happens at the consumer.
export function sanitizeStoredIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value.filter(
        (id): id is string =>
          typeof id === "string" && id.length > 0 && id.length <= 160,
      ),
    ),
  ].slice(0, 500);
}

export function readStoredSelection(mode: StoreMode): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(cartSelectionKey(mode));
    return sanitizeStoredIds(raw ? JSON.parse(raw) : []);
  } catch {
    return [];
  }
}

export function readStoredQuantities(mode: StoreMode): QuantityMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(cartQuantitiesKey(mode));
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};
    const allowed = readStoredSelection(mode);
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(
          ([id, value]) => allowed.includes(id) && typeof value === "string",
        )
        .map(([id, value]) => [id, String(value).slice(0, 40)]),
    );
  } catch {
    return {};
  }
}

export function notifyStoreCartUpdated(mode: StoreMode) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(STORE_CART_UPDATED_EVENT, { detail: { mode } }),
  );
}

export type CartSnapshot = {
  selected: string[];
  quantities: QuantityMap;
  loaded: boolean;
  persistent: boolean;
};

const serverSnapshot: CartSnapshot = {
  selected: [],
  quantities: {},
  loaded: false,
  persistent: true,
};
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

export function readLatestCartSnapshot(mode: StoreMode): CartSnapshot {
  const current = getCartSnapshot(mode);
  if (typeof window === "undefined" || !current.persistent) return current;
  const selected = readStoredSelection(mode);
  const quantities = readStoredQuantities(mode);
  if (
    JSON.stringify([selected, quantities]) !==
    JSON.stringify([current.selected, current.quantities])
  ) {
    snapshots[mode] = { ...current, selected, quantities };
    notifyStoreCartUpdated(mode);
  }
  return getCartSnapshot(mode);
}

// A shared cached snapshot of the existing storage, never a second checkout cart.
export function subscribeToCart(
  mode: StoreMode,
  onChange: () => void,
): () => void {
  const onStorage = (event: StorageEvent) => {
    if (
      event.key !== null &&
      event.key !== cartSelectionKey(mode) &&
      event.key !== cartQuantitiesKey(mode)
    )
      return;
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
  const selected = sanitizeStoredIds(next.selected);
  const quantities = Object.fromEntries(
    selected.map((id) => [id, next.quantities[id] ?? ""]),
  );
  let persistent = true;
  try {
    window.localStorage.setItem(
      cartSelectionKey(mode),
      JSON.stringify(selected),
    );
    window.localStorage.setItem(
      cartQuantitiesKey(mode),
      JSON.stringify(quantities),
    );
  } catch {
    // Keep the shared in-memory snapshot usable when storage is unavailable/full.
    persistent = false;
  }
  snapshots[mode] = { selected, quantities, loaded: true, persistent };
  notifyStoreCartUpdated(mode);
}
