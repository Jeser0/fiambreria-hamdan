import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium, devices } = require(
  process.env.HAMDAN_PLAYWRIGHT_MODULE ?? "playwright",
);
const base = process.env.HAMDAN_TEST_URL ?? "http://localhost:3000";
const output = process.env.HAMDAN_QA_OUTPUT ?? ".qa-output";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.HAMDAN_BROWSER_CHANNEL
    ? { channel: process.env.HAMDAN_BROWSER_CHANNEL }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const fixtures = {};

try {
  const response = await page.request.get(`${base}/api/catalog`);
  assert.equal(response.status(), 200);
  const catalog = await response.json();
  const product = catalog.products.find(
    (item) =>
      !item.image &&
      !item.imageAlt &&
      item.retailPrice !== undefined &&
      item.wholesalePrice !== undefined,
  );
  assert.ok(
    product,
    "Use a product without an original image so the UI can restore its state exactly.",
  );
  await page.goto(`${base}/minorista`);
  for (const [shape, width, height] of [
    ["square", 100, 100],
    ["portrait", 100, 200],
  ]) {
    fixtures[shape] = await page.evaluate(
      ({ width, height }) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#d49a24";
        ctx.fillRect(0, 0, width, height);
        return canvas.toDataURL("image/png");
      },
      { width, height },
    );
  }

  // Fixtures are generated locally and never persisted. Test the actual store media component.
  for (const [shape, image] of Object.entries(fixtures)) {
    const mocked = {
      ...catalog,
      products: catalog.products.map((item) =>
        item.id === product.id
          ? { ...item, image, imageAlt: `QA ${shape}` }
          : item,
      ),
    };
    await page.route("**/api/catalog", (route) =>
      route.fulfill({ json: mocked }),
    );
    for (const mode of ["minorista", "mayorista"]) {
      await page.goto(`${base}/${mode}?categoria=${product.category}`);
      const img = page.locator(`article#${product.id} img`);
      await img.waitFor();
      await page.waitForFunction(
        (id) => document.querySelector(`article#${id} img`)?.naturalWidth > 0,
        product.id,
      );
      const geometry = await img.evaluate((node) => ({
        fit: getComputedStyle(node).objectFit,
        position: getComputedStyle(node).objectPosition,
        ratio:
          node.parentElement.getBoundingClientRect().width /
          node.parentElement.getBoundingClientRect().height,
      }));
      assert.equal(geometry.fit, "contain");
      assert.equal(geometry.position, "50% 50%");
      assert.ok(Math.abs(geometry.ratio - 16 / 7) < 0.02);
    }
    await page.screenshot({
      path: `${output}/product-image-${shape}.png`,
      fullPage: true,
    });
    await page.unroute("**/api/catalog");
  }
  console.log(
    "PASS square and portrait images: both stores preserve proportions, center products and retain horizontal card height.",
  );
  await page.goto(`${base}/minorista?categoria=${product.category}`);
  await page.locator(`article#${product.id} .product-media-fallback`).waitFor();
  assert.equal(await page.locator(`article#${product.id} img`).count(), 0);
  console.log(
    "PASS product without image: original category placeholder remains available.",
  );

  const mobileContext = await browser.newContext({
    ...devices["iPhone 13"],
    reducedMotion: "reduce",
  });
  const mobile = await mobileContext.newPage();
  await mobile.route("**/api/catalog", (route) =>
    route.fulfill({
      json: {
        ...catalog,
        products: catalog.products.map((item) =>
          item.id === product.id ? { ...item, image: fixtures.portrait } : item,
        ),
      },
    }),
  );
  await mobile.goto(`${base}/minorista?categoria=${product.category}`);
  await mobile.locator(`article#${product.id} img`).waitFor();
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await mobile.screenshot({
    path: `${output}/product-image-mobile.png`,
    fullPage: true,
  });
  await mobileContext.close();
  console.log("PASS mobile: image fits without horizontal overflow.");

  if (!process.env.HAMDAN_ADMIN_EMAIL || !process.env.HAMDAN_ADMIN_PASSWORD) {
    console.log(
      "PENDING authenticated upload/replacement/removal: real admin credentials are required; no account or business data was changed.",
    );
  } else {
    await page.goto(`${base}/admin/login`);
    await page
      .getByLabel("Correo electrónico", { exact: true })
      .fill(process.env.HAMDAN_ADMIN_EMAIL);
    await page
      .getByLabel("Contraseña", { exact: true })
      .fill(process.env.HAMDAN_ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Ingresar", exact: true }).click();
    await page.waitForURL(`${base}/admin`);
    await page
      .getByLabel("Buscar producto", { exact: true })
      .fill(product.name);
    const editor = page.getByRole("group", {
      name: `Imagen de ${product.name}`,
      exact: true,
    });
    const save = () =>
      editor.getByRole("button", { name: "Guardar imagen", exact: true });
    let changed = false;
    try {
      // Both original prices must remain unchanged even if the commercial form has a draft.
      await page
        .getByRole("textbox", {
          name: `Precio minorista de ${product.name}`,
          exact: true,
        })
        .fill("1");
      await editor
        .getByLabel(`Seleccionar imagen de ${product.name}`, { exact: true })
        .setInputFiles({
          name: "invalid.svg",
          mimeType: "image/svg+xml",
          buffer: Buffer.from("<svg/>"),
        });
      await editor
        .getByRole("alert")
        .filter({ hasText: "WebP, JPEG o PNG" })
        .waitFor();
      let previousUrl;
      for (const shape of ["square", "portrait"]) {
        await editor
          .getByLabel(`Seleccionar imagen de ${product.name}`, { exact: true })
          .setInputFiles({
            name: "original-name.png",
            mimeType: "image/png",
            buffer: Buffer.from(fixtures[shape].split(",")[1], "base64"),
          });
        await editor
          .getByRole("status")
          .filter({ hasText: "Vista previa lista" })
          .waitFor();
        await editor
          .getByLabel("Descripción de la imagen", { exact: true })
          .fill("");
        await save().click();
        await editor
          .getByRole("status")
          .filter({ hasText: "Imagen guardada" })
          .waitFor();
        changed = true;
        const live = (
          await (await page.request.get(`${base}/api/catalog`)).json()
        ).products.find((item) => item.id === product.id);
        assert.equal(live.retailPrice, product.retailPrice);
        assert.equal(live.wholesalePrice, product.wholesalePrice);
        assert.equal(live.imageAlt, product.name);
        assert.ok(
          live.image.includes("/storage/v1/object/public/product-images/"),
        );
        assert.notEqual(live.image, previousUrl);
        assert.equal((await page.request.get(live.image)).status(), 200);
        if (previousUrl)
          assert.equal((await page.request.get(previousUrl)).ok(), false);
        previousUrl = live.image;
        const storefront = await context.newPage();
        for (const mode of ["minorista", "mayorista"]) {
          await storefront.goto(
            `${base}/${mode}?categoria=${product.category}`,
          );
          await storefront.locator(`article#${product.id} img`).waitFor();
          await storefront.waitForFunction(
            (id) =>
              document.querySelector(`article#${id} img`)?.naturalWidth > 0,
            product.id,
          );
        }
        await storefront.close();
      }
      await page.screenshot({
        path: `${output}/admin-product-image.png`,
        fullPage: true,
      });
      console.log(
        "PASS authenticated upload/replacement: valid public files, alt fallback, old object cleanup, both stores; unsaved price draft did not persist.",
      );
    } finally {
      // Restore the originally empty image even when another assertion fails.
      if (changed) {
        await editor
          .getByRole("button", { name: "Quitar imagen", exact: true })
          .click();
        await save().click();
        await editor
          .getByRole("status")
          .filter({ hasText: "Imagen quitada" })
          .waitFor();
        const restored = (
          await (await page.request.get(`${base}/api/catalog`)).json()
        ).products.find((item) => item.id === product.id);
        assert.equal(restored.image, undefined);
        assert.equal(restored.imageAlt, undefined);
        assert.equal(restored.retailPrice, product.retailPrice);
        assert.equal(restored.wholesalePrice, product.wholesalePrice);
        console.log("PASS removal and original-state restoration.");
      }
    }
    await page.goto(`${base}/minorista?categoria=${product.category}`);
    await page
      .locator(`article#${product.id} .product-media-fallback`)
      .waitFor();
    console.log("PASS removal restores category placeholder in the store.");
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
