import type { StoreMode } from "../data/catalog";
import { catalogMinimums, type CatalogSnapshot } from "./catalog";
import {
  buildWhatsAppMessage,
  emptyCheckout,
  validateCheckout,
  type CheckoutData,
} from "./checkout";
import { buildOrderLines, calculateOrderTotal } from "./order";
import type { QuantityMap } from "./storeCart";

export type OrderRequest = {
  mode: StoreMode;
  data: CheckoutData;
  selected: string[];
  quantities: QuantityMap;
};

const fieldLimits: Record<keyof CheckoutData, number> = {
  fullName: 120,
  phone: 30,
  orderType: 30,
  businessName: 120,
  taxId: 30,
  email: 254,
  notes: 800,
  delivery: 10,
  address: 200,
  locality: 120,
  reference: 200,
};

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

// Whitelist the payload. Prices, subtotals, product details and roles are never accepted.
export function parseOrderRequest(value: unknown): OrderRequest {
  if (
    !record(value) ||
    (value.mode !== "mayorista" && value.mode !== "minorista") ||
    !record(value.data) ||
    !Array.isArray(value.selected) ||
    value.selected.length > 500 ||
    !record(value.quantities)
  ) {
    throw new Error("El pedido tiene un formato inválido.");
  }
  const data = { ...emptyCheckout };
  for (const field of Object.keys(emptyCheckout) as (keyof CheckoutData)[]) {
    const input = value.data[field];
    if (typeof input !== "string" || input.length > fieldLimits[field])
      throw new Error("Revisá los datos del formulario.");
    Object.assign(data, { [field]: input });
  }
  const selected = [
    ...new Set(
      value.selected.map((id: unknown) => {
        if (typeof id !== "string" || !id.length || id.length > 160)
          throw new Error("El pedido tiene un producto inválido.");
        return id;
      }),
    ),
  ];
  const inputQuantities = value.quantities;
  const quantities = Object.fromEntries(
    selected.map((id) => {
      const quantity = inputQuantities[id];
      if (typeof quantity !== "string" || quantity.length > 12)
        throw new Error("Revisá las cantidades del pedido.");
      return [id, quantity];
    }),
  );
  return { mode: value.mode, data, selected, quantities };
}

export function orderReviewSignature(
  snapshot: CatalogSnapshot,
  mode: StoreMode,
  selected: readonly string[],
  quantities: QuantityMap,
): string {
  const lines = buildOrderLines(mode, selected, quantities, snapshot.products);
  return JSON.stringify({
    lines: lines.map((line) => ({
      id: line.product.id,
      name: line.product.name,
      category: line.product.category,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      subtotal: line.subtotal,
      error: line.quantityError,
    })),
    categories: snapshot.categories
      .filter((category) =>
        lines.some((line) => line.product.category === category.id),
      )
      .map(({ id, label, wholesaleMinimum }) => ({
        id,
        label,
        minimum: mode === "mayorista" ? wholesaleMinimum : 0,
      })),
    total: calculateOrderTotal(lines),
  });
}

export function prepareOrder(snapshot: CatalogSnapshot, input: unknown) {
  const { mode, data, selected, quantities } = parseOrderRequest(input);
  const lines = buildOrderLines(mode, selected, quantities, snapshot.products);
  const minimums = catalogMinimums(snapshot);
  const validation = validateCheckout(
    data,
    lines,
    mode,
    snapshot.categories,
    minimums,
  );
  return {
    snapshot,
    validation,
    signature: orderReviewSignature(snapshot, mode, selected, quantities),
    message: validation.valid
      ? buildWhatsAppMessage(data, lines, mode, snapshot.categories, minimums)
      : null,
  };
}
