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
const send = () =>
  page.getByRole("button", { name: "Enviar pedido por WhatsApp", exact: true });

async function captureWhatsApp() {
  await page.evaluate(() => {
    window.__hamdanOrderUrl = null;
    window.open = (url) => {
      if (String(url).startsWith("https://wa.me/"))
        window.__hamdanOrderUrl = url;
      return null;
    };
  });
}

try {
  const catalogResponse = await page.request.get(`${base}/api/catalog`);
  assert.equal(catalogResponse.status(), 200);
  assert.match(catalogResponse.headers()["cache-control"], /no-store/);
  const catalog = await catalogResponse.json();
  assert.equal(catalog.categories.length, 5);
  assert.equal(catalog.products.length, 57);
  assert.deepEqual(
    Object.fromEntries(
      catalog.categories.map((item) => [item.id, item.wholesaleMinimum]),
    ),
    {
      quesos: 0,
      fiambres: 0,
      "sandwich-x4": 20,
      "sandwich-x8": 40,
      pizzas: 20,
    },
  );
  console.log(
    "PASS live catalog: 57 database products, 5 categories, current minimums, no HTTP cache.",
  );

  await page.goto(`${base}/admin`);
  await page.waitForURL("**/admin/login");
  await page
    .getByLabel("Correo electrónico", { exact: true })
    .fill("hamdan-qa-nonexistent@example.invalid");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("Invalid-test-password-123!");
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "No pudimos iniciar sesión" })
    .waitFor();
  assert.match(page.url(), /\/admin\/login$/);
  await page.screenshot({
    path: `${output}/admin-login-desktop.png`,
    fullPage: true,
  });
  console.log(
    "PASS admin: protected route, real Auth rejects invalid credentials, login error is visible.",
  );

  // Simulate a manipulated/stale browser catalog. The server still reads the real database.
  const id = "cremoso-san-blas";
  const original = catalog.products.find((product) => product.id === id);
  assert.ok(original?.retailPrice > 0);
  const forged = {
    ...catalog,
    products: catalog.products.map((product) =>
      product.id === id ? { ...product, retailPrice: 1 } : product,
    ),
  };
  await page.route("**/api/catalog", (route) =>
    route.fulfill({ json: forged }),
  );
  await page.goto(`${base}/minorista?categoria=quesos`);
  await page.waitForFunction(
    (productId) =>
      document
        .querySelector(`article#${productId}`)
        ?.textContent.includes("$ 1"),
    id,
  );
  await page
    .locator(`article#${id}`)
    .getByRole("button", { name: "+ Agregar", exact: true })
    .click();
  await page
    .locator("#carrito")
    .getByRole("link", { name: /Revisar y finalizar/ })
    .click();
  await page.waitForURL("**/pedido/minorista");
  await page
    .getByLabel("Nombre y apellido", { exact: false })
    .fill("Cliente Prueba");
  await page
    .getByLabel("Número de teléfono", { exact: false })
    .fill("3811234567");
  await page
    .getByLabel("Tipo de pedido", { exact: false })
    .selectOption("particular");
  await page.waitForFunction(
    () =>
      document.querySelector('[data-testid="order-total"]')?.textContent ===
      "$ 1",
  );
  await page.unroute("**/api/catalog");
  await captureWhatsApp();
  await send().click();
  await page
    .getByRole("alert")
    .filter({ hasText: "El pedido cambió" })
    .waitFor();
  assert.equal(await page.evaluate(() => window.__hamdanOrderUrl), null);
  const expected = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(original.retailPrice)
    .replace(/\u00a0/g, " ");
  await page.waitForFunction(
    (total) =>
      document.querySelector('[data-testid="order-total"]')?.textContent ===
      total,
    expected,
  );
  console.log(
    "PASS checkout: manipulated browser price cannot reach WhatsApp; server replaces it and requests review.",
  );

  await page.evaluate((productId) => {
    localStorage.setItem(
      "hamdan-minorista-quantities",
      JSON.stringify({
        [productId]: "2",
        unitPrice: "1",
        total: "1",
        price: 1,
      }),
    );
  }, id);
  await send().click();
  await page.waitForFunction(() => Boolean(window.__hamdanOrderUrl));
  const message = new URL(
    await page.evaluate(() => window.__hamdanOrderUrl),
  ).searchParams.get("text");
  const total = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(original.retailPrice * 2)
    .replace(/\u00a0/g, " ");
  assert.ok(message.includes(`TOTAL ESTIMADO: ${total}`));
  assert.ok(message.includes(`2 × ${original.name}`));
  console.log(
    "PASS storage tampering: fresh quantities are read at submit; forged prices and totals are ignored.",
  );

  const withoutProduct = {
    ...catalog,
    products: catalog.products.filter((product) => product.id !== id),
  };
  await page.route("**/api/catalog", (route) =>
    route.fulfill({ json: withoutProduct }),
  );
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await page.getByText("Tu carrito está vacío.", { exact: true }).waitFor();
  await page.waitForFunction(
    () =>
      JSON.parse(localStorage.getItem("hamdan-minorista-selection")).length ===
      0,
  );
  assert.equal(await send().isDisabled(), true);
  console.log(
    "PASS catalog removal: unavailable IDs are removed from persistence and checkout cannot submit.",
  );
  await page.unroute("**/api/catalog");

  const mobileContext = await browser.newContext({
    ...devices["iPhone 13"],
    reducedMotion: "reduce",
  });
  const mobile = await mobileContext.newPage();
  await mobile.goto(`${base}/admin/login`);
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await mobile.screenshot({
    path: `${output}/admin-login-mobile.png`,
    fullPage: true,
  });
  await mobileContext.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS admin mobile: accessible login form without horizontal overflow.",
  );

  // Optional manual credentials stay in the invoking process environment and are never logged.
  if (process.env.HAMDAN_ADMIN_EMAIL && process.env.HAMDAN_ADMIN_PASSWORD) {
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
      .getByRole("heading", { name: "Tus productos", exact: true })
      .waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Guardar cambios", exact: true })
        .count(),
      57,
    );
    await page
      .getByLabel("Buscar producto", { exact: true })
      .fill(original.name);
    assert.equal(
      await page
        .getByRole("button", { name: "Guardar cambios", exact: true })
        .count(),
      1,
    );
    // Saving existing verified prices exercises the real action without changing business data.
    await page
      .getByRole("button", { name: "Guardar cambios", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "Cambios guardados" })
      .waitFor();
    await page
      .getByRole("button", { name: "Cerrar sesión", exact: true })
      .click();
    await page.waitForURL("**/admin/login");
    console.log(
      "PASS owner: real login, protected dashboard, search, product save and logout.",
    );
  } else {
    console.log(
      "PENDING owner browser verification: credentials were not provided; SQL owner/RLS tests run separately.",
    );
  }
} finally {
  await browser.close();
}
