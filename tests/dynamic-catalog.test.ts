import assert from "node:assert/strict";
import test from "node:test";
import {
  catalogMinimums,
  mapCatalogSnapshot,
  type CatalogSnapshot,
} from "../src/lib/catalog";
import { buildOrderLines, calculateOrderTotal } from "../src/lib/order";
import {
  emptyCheckout,
  validateCheckout,
  buildWhatsAppMessage,
} from "../src/lib/checkout";
import {
  parseOrderRequest,
  prepareOrder,
  orderReviewSignature,
} from "../src/lib/prepare-order";
import {
  sanitizeSelection,
  sanitizeStoredIds,
  readStoredSelection,
  readStoredQuantities,
  cartSelectionKey,
  cartQuantitiesKey,
} from "../src/lib/storeCart";
import type { Database } from "../src/lib/supabase/database.types";

const category: Database["public"]["Tables"]["categories"]["Row"] = {
  id: "sandwich-x4",
  name: "Sándwich surtidos",
  wholesale_minimum: 25,
  sort_order: 1,
  active: true,
  created_at: "",
  updated_at: "",
};
const product: Database["public"]["Tables"]["products"]["Row"] = {
  id: "nuevo-en-db",
  name: "Producto desde la base",
  category_id: "sandwich-x4",
  retail_price: 9000,
  wholesale_price: 8500,
  wholesale_same_price: false,
  active: true,
  in_stock: true,
  image_url: "/existing.webp",
  image_alt: "Foto original",
  sort_order: 1,
  created_at: "",
  updated_at: "",
};
const snapshot = () => mapCatalogSnapshot([category], [product]);
const request = () => ({
  mode: "mayorista",
  data: {
    ...emptyCheckout,
    fullName: "Juan Pérez",
    phone: "3811234567",
    orderType: "particular",
  },
  selected: [product.id],
  quantities: { [product.id]: "25" },
});

test("database product and category mapping preserves prices, stock and existing images", () => {
  const catalog = snapshot();
  assert.equal(catalog.products[0].wholesalePrice, 8500);
  assert.equal(catalog.products[0].image, "/existing.webp");
  assert.equal(catalog.products[0].imageAlt, "Foto original");
  assert.deepEqual(catalogMinimums(catalog), { "sandwich-x4": 25 });
  assert.equal(
    mapCatalogSnapshot([{ ...category, active: false }], [product]).products
      .length,
    0,
  );
  for (const changes of [
    { active: false },
    { in_stock: false },
    { category_id: "missing" },
  ]) {
    assert.equal(
      mapCatalogSnapshot([category], [{ ...product, ...changes }]).products
        .length,
      0,
    );
  }
});

test("every commercial calculation and WhatsApp uses current database prices", () => {
  const input = request();
  const old = mapCatalogSnapshot(
    [category],
    [{ ...product, wholesale_price: 7700 }],
  );
  const current = snapshot();
  assert.equal(
    calculateOrderTotal(
      buildOrderLines(
        "mayorista",
        input.selected,
        input.quantities,
        old.products,
      ),
    ),
    192500,
  );
  const prepared = prepareOrder(current, input);
  assert.match(prepared.message!, /\$ 8\.500 c\/u/);
  assert.match(prepared.message!, /TOTAL ESTIMADO: \$ 212\.500/);
  assert.match(prepared.message!, /Sándwich surtidos/);
  assert.notEqual(
    prepared.signature,
    orderReviewSignature(old, "mayorista", input.selected, input.quantities),
  );
});

test("dynamic minimums govern validation and message generation, including an explicit empty map", () => {
  const catalog = snapshot();
  const input = request();
  const lines = buildOrderLines(
    "mayorista",
    input.selected,
    { [product.id]: "20" },
    catalog.products,
  );
  const customer = parseOrderRequest(input).data;
  assert.equal(validateCheckout(customer, lines, "mayorista").valid, true);
  assert.equal(
    validateCheckout(
      customer,
      lines,
      "mayorista",
      catalog.categories,
      catalogMinimums(catalog),
    ).valid,
    false,
  );
  assert.throws(() =>
    buildWhatsAppMessage(
      customer,
      lines,
      "mayorista",
      catalog.categories,
      catalogMinimums(catalog),
    ),
  );
  assert.equal(
    validateCheckout(customer, lines, "mayorista", catalog.categories, {})
      .valid,
    true,
  );
  assert.equal(
    prepareOrder(
      {
        ...catalog,
        categories: [{ ...catalog.categories[0], wholesaleMinimum: 30 }],
      },
      input,
    ).message,
    null,
  );
  assert.equal(
    prepareOrder(catalog, {
      ...input,
      mode: "minorista",
      quantities: { [product.id]: "1" },
    }).validation.valid,
    true,
  );
});

test("removed, inactive, out-of-stock and wrong-store products cannot be purchased", () => {
  const input = request();
  for (const changes of [
    { active: false },
    { inStock: false },
    { wholesalePrice: undefined },
  ]) {
    const catalog: CatalogSnapshot = {
      ...snapshot(),
      products: [{ ...snapshot().products[0], ...changes }],
    };
    assert.equal(prepareOrder(catalog, input).message, null);
    assert.deepEqual(
      sanitizeSelection(input.selected, "mayorista", catalog.products),
      [],
    );
  }
  assert.equal(
    prepareOrder({ ...snapshot(), products: [] }, input).validation.valid,
    false,
  );
  assert.deepEqual(
    sanitizeSelection(
      [product.id, product.id, "missing"],
      "mayorista",
      snapshot().products,
    ),
    [product.id],
  );
});

test("server payload ignores forged prices, totals, lines and roles", () => {
  const input = {
    ...request(),
    unitPrice: 1,
    total: 1,
    lines: [{ unitPrice: 1 }],
    role: "admin",
    quantities: { [product.id]: "25", price: "1" },
  };
  const parsed = parseOrderRequest(input);
  assert.deepEqual(Object.keys(parsed), [
    "mode",
    "data",
    "selected",
    "quantities",
  ]);
  assert.deepEqual(parsed.quantities, { [product.id]: "25" });
  assert.match(
    prepareOrder(snapshot(), input).message!,
    /TOTAL ESTIMADO: \$ 212\.500/,
  );
});

test("invalid and oversized server payloads fail before catalog access", () => {
  for (const bad of [
    null,
    [],
    { ...request(), mode: "wrong" },
    { ...request(), data: {} },
    { ...request(), selected: [3] },
    { ...request(), quantities: { [product.id]: 2 } },
    { ...request(), quantities: { [product.id]: { price: 1 } } },
    { ...request(), selected: Array(501).fill(product.id) },
    { ...request(), data: { ...request().data, notes: "x".repeat(801) } },
  ]) {
    assert.throws(() => parseOrderRequest(bad));
  }
  for (const quantity of ["-1", "1e3", "0", "1.5", "Infinity"]) {
    assert.equal(
      prepareOrder(snapshot(), {
        ...request(),
        quantities: { [product.id]: quantity },
      }).message,
      null,
    );
  }
});

test("storage retains database-only IDs and quantities without persisting or trusting prices", () => {
  const storage = new Map([
    [
      cartSelectionKey("mayorista"),
      JSON.stringify([product.id, product.id, 12, "missing"]),
    ],
    [
      cartQuantitiesKey("mayorista"),
      JSON.stringify({
        [product.id]: "25",
        unitPrice: "1",
        subtotal: 1,
        missing: { price: 1 },
      }),
    ],
  ]);
  Object.defineProperty(globalThis, "window", {
    value: {
      localStorage: { getItem: (key: string) => storage.get(key) ?? null },
    },
    configurable: true,
  });
  try {
    assert.deepEqual(readStoredSelection("mayorista"), [product.id, "missing"]);
    assert.deepEqual(readStoredQuantities("mayorista"), { [product.id]: "25" });
    assert.deepEqual(
      sanitizeSelection(
        readStoredSelection("mayorista"),
        "mayorista",
        snapshot().products,
      ),
      [product.id],
    );
    assert.deepEqual(sanitizeStoredIds({ unitPrice: 1 }), []);
  } finally {
    Reflect.deleteProperty(globalThis, "window");
  }
});

test("mapping rejects invalid database prices and minimums instead of falling back", () => {
  for (const price of [-1, NaN, Infinity, 1000000000])
    assert.throws(() =>
      mapCatalogSnapshot([category], [{ ...product, wholesale_price: price }]),
    );
  for (const minimum of [-1, NaN, Infinity, 1.5])
    assert.throws(() =>
      mapCatalogSnapshot(
        [{ ...category, wholesale_minimum: minimum }],
        [product],
      ),
    );
  assert.equal(
    mapCatalogSnapshot([category], [{ ...product, wholesale_price: null }])
      .products[0].wholesalePrice,
    undefined,
  );
});
