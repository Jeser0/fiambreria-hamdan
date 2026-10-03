import assert from "node:assert/strict";
import test from "node:test";
import { parseAdminPrice, parseProductEdit } from "../src/lib/admin-product";

test("admin validation rejects invalid prices and whitelists editable fields", () => {
  assert.equal(parseAdminPrice("8500,50"), 8500.5);
  assert.equal(parseAdminPrice("0"), 0);
  assert.equal(parseAdminPrice(""), null);
  for (const price of [
    null,
    -1,
    "-1",
    "NaN",
    "Infinity",
    "1e3",
    "8500.001",
    "1000000000",
    " 8500 ",
  ])
    assert.throws(() => parseAdminPrice(price));
  const form = new FormData();
  Object.entries({
    id: "product-id",
    updatedAt: "2026-10-02T12:00:00Z",
    retailPrice: "9000",
    wholesalePrice: "8500",
    active: "on",
    inStock: "on",
    role: "owner",
    image_url: "replace",
  }).forEach(([key, value]) => form.set(key, value));
  assert.deepEqual(parseProductEdit(form).changes, {
    retail_price: 9000,
    wholesale_price: 8500,
    wholesale_same_price: false,
    active: true,
    in_stock: true,
  });
  form.set("retailPrice", "");
  form.set("wholesalePrice", "");
  assert.throws(() => parseProductEdit(form));
  form.set("retailPrice", "9000");
  form.set("active", "true");
  assert.throws(() => parseProductEdit(form));
});
