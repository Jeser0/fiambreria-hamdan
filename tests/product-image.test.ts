import assert from "node:assert/strict";
import test from "node:test";
import {
  managedProductImagePath,
  productImagePath,
  isProductImagePath,
  parseProductImageEdit,
  validateProductImage,
  validateProductImageContents,
  MAX_PRODUCT_IMAGE_BYTES,
} from "../src/lib/product-image";
import { mapCatalogSnapshot } from "../src/lib/catalog";
import type { Database } from "../src/lib/supabase/database.types";
import { persistProductImage } from "../src/lib/persist-product-image";

const id = "cremoso-san-blas";
const uuid = "12345678-1234-4321-9876-123456789abc";
const path = `${id}/${uuid}.webp`;
const base = "https://hamdan.supabase.co";
const url = `${base}/storage/v1/object/public/product-images/${path}`;

test("replacement deletes the previous file only after the product commit", async () => {
  const operations: string[] = [];
  const saved = await persistProductImage({
    id,
    baseUrl: base,
    oldUrl: url,
    newUrl: `${url}.new`,
    save: async () => {
      operations.push("commit");
      return "new-version";
    },
    remove: async (oldPath) => {
      operations.push(`delete:${oldPath}`);
      return true;
    },
  });
  assert.deepEqual(operations, ["commit", `delete:${path}`]);
  assert.deepEqual(saved, { updatedAt: "new-version", cleanupFailed: false });
});

test("database failures and concurrent edits preserve the old file", async () => {
  let deletes = 0;
  const options = {
    id,
    baseUrl: base,
    oldUrl: url,
    newUrl: null,
    remove: async () => {
      deletes++;
      return true;
    },
  };
  const conflict = await persistProductImage({
    ...options,
    save: async () => null,
  });
  assert.equal(conflict.updatedAt, null);
  await assert.rejects(
    persistProductImage({
      ...options,
      save: async () => {
        throw new Error("database failure");
      },
    }),
  );
  assert.equal(deletes, 0);
});

test("cleanup failure preserves a successful save and reports pending cleanup", async () => {
  for (const remove of [
    async () => false,
    async () => {
      throw new Error("storage failure");
    },
  ]) {
    const result = await persistProductImage({
      id,
      baseUrl: base,
      oldUrl: url,
      newUrl: null,
      save: async () => "committed",
      remove,
    });
    assert.deepEqual(result, { updatedAt: "committed", cleanupFailed: true });
  }
});

test("alt-only saves and external commercial images do not delete files", async () => {
  let deletes = 0;
  for (const [oldUrl, newUrl] of [
    [url, url],
    ["/commercial.webp", null],
    [null, url],
  ]) {
    await persistProductImage({
      id,
      baseUrl: base,
      oldUrl,
      newUrl,
      save: async () => "committed",
      remove: async () => {
        deletes++;
        return true;
      },
    });
  }
  assert.equal(deletes, 0);
});

test("uploads enforce MIME, nonempty content and 5 MB before processing", () => {
  for (const type of ["image/webp", "image/png", "image/jpeg"]) {
    validateProductImage({ size: MAX_PRODUCT_IMAGE_BYTES, type });
  }
  for (const type of [
    "image/svg+xml",
    "image/gif",
    "text/html",
    "",
    "image/jpg",
  ]) {
    assert.throws(() => validateProductImage({ size: 100, type }));
  }
  for (const size of [0, MAX_PRODUCT_IMAGE_BYTES + 1])
    assert.throws(() => validateProductImage({ size, type: "image/png" }));
});

test("server verifies image signatures rather than MIME declarations alone", async () => {
  await validateProductImageContents(
    new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], {
      type: "image/png",
    }),
  );
  await validateProductImageContents(
    new Blob([new Uint8Array([255, 216, 255, 224])], { type: "image/jpeg" }),
  );
  await validateProductImageContents(
    new Blob(["RIFF0000WEBPVP8 "], { type: "image/webp" }),
  );
  for (const type of ["image/png", "image/jpeg", "image/webp"]) {
    await assert.rejects(
      validateProductImageContents(
        new Blob(["<script>bad</script>"], { type }),
      ),
    );
  }
  await assert.rejects(
    validateProductImageContents(
      new Blob(["RIFF0000WEBPHTML"], { type: "image/webp" }),
    ),
  );
});

test("safe immutable paths ignore original filenames and cannot target other products", () => {
  assert.equal(productImagePath(id, uuid, "image/webp"), path);
  assert.ok(isProductImagePath(path, id));
  assert.notEqual(
    productImagePath(id, "87654321-1234-4321-9876-123456789abc", "image/webp"),
    path,
  );
  for (const candidate of [
    `../${path}`,
    `${path}?x=1`,
    `${path}/extra`,
    "other/a.png",
    url,
    `${id}/file.png`,
  ])
    assert.equal(isProductImagePath(candidate, id), false);
  assert.throws(() => productImagePath("../escape", uuid, "image/webp"));
  assert.throws(() => productImagePath(id, "original-file", "image/png"));
});

test("cleanup only accepts exact owned bucket URLs, preserving external commercial images", () => {
  assert.equal(managedProductImagePath(url, base, id), path);
  for (const candidate of [
    null,
    "/commercial.webp",
    url.replace("hamdan.supabase.co", "other.supabase.co"),
    url.replace("product-images", "other-bucket"),
    `${url}?x=1`,
    `${url}#x`,
    `${base}/storage/v1/object/public/product-images/${id}/%2e%2e/file.png`,
  ])
    assert.equal(managedProductImagePath(candidate, base, id), null);
  assert.equal(managedProductImagePath(url, base, "other-product"), null);
});

test("image edits whitelist inputs and reject invalid paths, intentions, versions and alt", () => {
  const form = new FormData();
  Object.entries({
    id,
    updatedAt: "2026-10-03T12:00:00Z",
    intent: "replace",
    path,
    imageAlt: "  Queso cremoso  ",
    retailPrice: "1",
    role: "owner",
  }).forEach(([key, value]) => form.set(key, value));
  assert.deepEqual(parseProductImageEdit(form), {
    id,
    updatedAt: "2026-10-03T12:00:00Z",
    intent: "replace",
    path,
    alt: "Queso cremoso",
  });
  form.set("intent", "remove");
  assert.equal(parseProductImageEdit(form).path, null);
  form.set("intent", "replace");
  form.set("path", "another-product/file.png");
  assert.throws(() => parseProductImageEdit(form));
  form.set("path", path);
  form.set("imageAlt", "a".repeat(301));
  assert.throws(() => parseProductImageEdit(form));
  form.set("imageAlt", "");
  form.set("updatedAt", "invalid");
  assert.throws(() => parseProductImageEdit(form));
});

test("dynamic catalog maps replacement and removal for every category without changing prices", () => {
  for (const category_id of [
    "quesos",
    "fiambres",
    "sandwich-x4",
    "sandwich-x8",
    "pizzas",
  ]) {
    const category = {
      id: category_id,
      name: category_id,
      active: true,
      sort_order: 1,
      wholesale_minimum: 0,
      created_at: "",
      updated_at: "",
    };
    const product: Database["public"]["Tables"]["products"]["Row"] = {
      id,
      name: "Producto",
      category_id,
      retail_price: 100,
      wholesale_price: 90,
      wholesale_same_price: false,
      active: true,
      in_stock: true,
      image_url: url,
      image_alt: "Producto",
      created_at: "",
      updated_at: "",
      sort_order: 1,
    };
    const first = mapCatalogSnapshot([category], [product]).products[0];
    assert.equal(first.image, url);
    const replacement = mapCatalogSnapshot(
      [category],
      [{ ...product, image_url: `${url}.replacement` }],
    ).products[0];
    assert.equal(replacement.image, `${url}.replacement`);
    const removed = mapCatalogSnapshot(
      [category],
      [{ ...product, image_url: null, image_alt: null }],
    ).products[0];
    assert.equal(removed.image, undefined);
    assert.equal(removed.imageAlt, undefined);
    assert.equal(removed.retailPrice, first.retailPrice);
    assert.equal(removed.wholesalePrice, first.wholesalePrice);
  }
});
