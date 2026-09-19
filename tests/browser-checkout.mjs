import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

// Optional browser checks; Playwright is a development tool, not an app dependency.
const require = createRequire(import.meta.url);
const { chromium, webkit, devices } = require(
  process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES
    ? `${process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES}/playwright`
    : "playwright",
);
const url = process.env.HAMDAN_TEST_URL ?? "http://localhost:3000";
const output = process.env.HAMDAN_QA_OUTPUT ?? ".qa-output";
await mkdir(output, { recursive: true });
const launchOptions = { headless: true };
if (process.env.HAMDAN_CHROMIUM_RUNTIME) {
  const loadedRuntime = require(process.env.HAMDAN_CHROMIUM_RUNTIME);
  const runtime = loadedRuntime.default ?? loadedRuntime;
  launchOptions.executablePath =
    process.env.HAMDAN_CHROMIUM_EXECUTABLE ?? (await runtime.executablePath());
  launchOptions.args = ["--disable-gpu", "--disable-dev-shm-usage"];
}
const browser = await chromium.launch(launchOptions);
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const summary = page.locator("#carrito");
const send = () =>
  page.getByRole("button", { name: "Enviar pedido por WhatsApp", exact: true });
const quantity = (name) =>
  page.getByRole("textbox", { name: `Cantidad para ${name}`, exact: true });
const total = async (expected) =>
  assert.equal(await summary.getByTestId("order-total").innerText(), expected);
async function interceptWhatsApp(target) {
  await target.evaluate(() => {
    window.open = (url) => {
      window.__hamdanOrderUrl = url;
      return null;
    };
  });
}
async function waitTotal(expected) {
  await page.waitForFunction(
    (value) =>
      document.querySelector('[data-testid="order-total"]')?.textContent ===
      value,
    expected,
  );
}
async function add(id) {
  await page
    .locator(`article#${id}`)
    .getByRole("button", { name: "+ Agregar", exact: true })
    .click();
}

try {
  await page.goto(`${url}/mayorista?categoria=sandwich-x4`);
  await add("sandwich-x4-jamon-queso");
  await total("$ 2.250");
  await summary.getByRole("link", { name: /Revisar y finalizar/ }).click();
  await page.waitForURL("**/pedido/mayorista");
  await page
    .getByLabel("Nombre y apellido", { exact: false })
    .fill("Juan Pérez");
  await page
    .getByLabel("Número de teléfono", { exact: false })
    .fill("3811234567");
  await page
    .getByLabel("Tipo de pedido", { exact: false })
    .selectOption("particular");
  assert.equal(await send().isDisabled(), true);
  assert.match(await summary.innerText(), /Faltan 19 paquetes/);
  await quantity("Sándwich x4 — Jamón y queso").fill("1,5");
  assert.match(await summary.innerText(), /paquetes enteros/);
  await quantity("Sándwich x4 — Jamón y queso").fill("10");
  await page.getByRole("link", { name: /Seguir comprando/ }).click();
  await add("sandwich-x4-salame-queso");
  await add("sandwich-x4-ternera-queso");
  await quantity("Sándwich x4 — Salame y queso").fill("5");
  await quantity("Sándwich x4 — Ternera y queso").fill("5");
  assert.match(await summary.innerText(), /20\/20 paquetes/);
  await add("pizza-muzzarella");
  await quantity("Pizza Muzzarella").fill("20");
  await summary.getByRole("link", { name: /Revisar y finalizar/ }).click();
  await page.waitForURL("**/pedido/mayorista");
  await page.waitForFunction(() => {
    const fieldset = document.querySelector("#checkout-form fieldset");
    return fieldset && !fieldset.disabled;
  });
  assert.equal(
    await page.getByLabel("Nombre y apellido", { exact: false }).inputValue(),
    "Juan Pérez",
  );
  assert.equal(await send().isEnabled(), true);
  await summary
    .getByRole("button", {
      name: "Quitar Sándwich x4 — Ternera y queso",
      exact: true,
    })
    .click();
  assert.equal(await send().isDisabled(), true);
  await quantity("Sándwich x4 — Jamón y queso").fill("100");
  await quantity("Sándwich x4 — Salame y queso").fill("50");
  await total("$ 437.500");

  await page
    .getByLabel("Tipo de pedido", { exact: false })
    .selectOption("comercio");
  assert.equal(await send().isDisabled(), true);
  await page
    .getByLabel("Nombre del comercio", { exact: false })
    .fill("Almacén San Martín & Hijos");
  await page
    .getByLabel("Correo electrónico", { exact: false })
    .fill("correo-mal");
  assert.equal(await send().isDisabled(), true);
  await page
    .getByLabel("Correo electrónico", { exact: false })
    .fill("juan@example.com");
  await page
    .locator("label")
    .filter({ has: page.getByRole("radio", { name: "Envío", exact: true }) })
    .click();
  assert.equal(
    await page.getByRole("radio", { name: "Envío", exact: true }).isChecked(),
    true,
  );
  assert.equal(await send().isDisabled(), true);
  await page
    .getByLabel("Dirección", { exact: false })
    .fill("Calle San Martín 123");
  await page
    .getByLabel("Localidad / zona", { exact: true })
    .fill("Yerba Buena");
  await page.getByLabel("Referencia", { exact: false }).fill("Portón verde");
  await page
    .getByLabel("DNI o CUIT/CUIL", { exact: false })
    .fill("20-12345678-9");
  await page
    .getByLabel("Observaciones", { exact: false })
    .fill("Entregar por la tarde 🧀");
  assert.equal(await send().isEnabled(), true);
  await interceptWhatsApp(page);
  await send().click();
  let message = await page.evaluate(() =>
    new URL(window.__hamdanOrderUrl).searchParams.get("text"),
  );
  for (const phrase of [
    "pedido mayorista",
    "TOTAL ESTIMADO: $ 437.500",
    "Almacén San Martín & Hijos",
    "Modalidad: Envío",
    "Dirección: Calle San Martín 123",
    "Localidad / zona: Yerba Buena",
    "Portón verde",
    "juan@example.com",
    "Entregar por la tarde 🧀",
  ])
    assert.ok(message.includes(phrase), phrase);
  assert.equal(
    await summary.getByRole("textbox").count(),
    3,
    "Cart stays intact after opening WhatsApp",
  );
  await page.screenshot({
    path: `${output}/checkout-desktop.png`,
    fullPage: true,
  });

  await page
    .locator("label")
    .filter({
      has: page.getByRole("radio", { name: "Retiro del local", exact: true }),
    })
    .click();
  assert.equal(
    await page
      .getByRole("radio", { name: "Retiro del local", exact: true })
      .isChecked(),
    true,
  );
  await page
    .getByLabel("Tipo de pedido", { exact: false })
    .selectOption("particular");
  assert.equal(await page.getByLabel("Dirección", { exact: false }).count(), 0);
  await send().click();
  message = await page.evaluate(() =>
    new URL(window.__hamdanOrderUrl).searchParams.get("text"),
  );
  assert.match(message, /Retiro en: Av\. Colón 340, San Miguel de Tucumán/);
  assert.ok(!message.includes("Dirección:"));
  assert.ok(!message.includes("Portón verde"));
  assert.ok(!message.includes("Comercio:"));
  await page.reload();
  await waitTotal("$ 437.500");
  assert.equal(
    await quantity("Sándwich x4 — Jamón y queso").inputValue(),
    "100",
  );

  await page.goto(`${url}/minorista?categoria=sandwich-x4`);
  await add("sandwich-x4-jamon-queso");
  await total("$ 4.500");
  await summary.getByRole("link", { name: /Revisar y finalizar/ }).click();
  await page.waitForURL("**/pedido/minorista");
  await page
    .getByLabel("Nombre y apellido", { exact: false })
    .fill("Ana Gómez");
  await page
    .getByLabel("Número de teléfono", { exact: false })
    .fill("3817654321");
  await page
    .getByLabel("Tipo de pedido", { exact: false })
    .selectOption("evento");
  await page
    .getByLabel("Nombre o referencia del evento", { exact: false })
    .fill("Cumpleaños familiar");
  assert.equal(
    await send().isEnabled(),
    true,
    "Retail has no wholesale minimum",
  );
  await quantity("Sándwich x4 — Jamón y queso").fill("2");
  await total("$ 9.000");
  await interceptWhatsApp(page);
  await send().click();
  message = await page.evaluate(() =>
    new URL(window.__hamdanOrderUrl).searchParams.get("text"),
  );
  assert.match(message, /pedido minorista/);
  assert.match(message, /TOTAL ESTIMADO: \$ 9\.000/);
  assert.ok(
    !message.includes("Correo:") && !message.includes("DNI/CUIT/CUIL:"),
  );

  const otherTab = await context.newPage();
  await otherTab.goto(`${url}/pedido/minorista`);
  await otherTab
    .getByRole("textbox", {
      name: "Cantidad para Sándwich x4 — Jamón y queso",
      exact: true,
    })
    .fill("3");
  await waitTotal("$ 13.500");
  await otherTab.close();
  await summary.getByRole("button", { name: "Vaciar", exact: true }).click();
  await total("$ 0");
  assert.equal(await send().isDisabled(), true);
  await page.goto(`${url}/pedido/mayorista`);
  await waitTotal("$ 437.500");
  assert.equal(await page.locator('img[src*="showcase"]').count(), 0);
  console.log(
    "PASS desktop: wholesale/retail, minimums, editable totals, conditional form, delivery/pickup, WhatsApp, reload, tabs and empty cart.",
  );

  for (const [label, device] of [
    ["android", devices["Pixel 7"]],
    ["iphone-chromium", devices["iPhone 13"]],
  ]) {
    const mobileContext = await browser.newContext({
      ...device,
      reducedMotion: "reduce",
    });
    const mobile = await mobileContext.newPage();
    mobile.on("pageerror", (error) => errors.push(error.message));
    await mobile.goto(`${url}/`);
    await mobile
      .getByRole("heading", { name: "Bienvenidos a Fiambrería Hamdan" })
      .waitFor();
    await mobile.waitForLoadState("networkidle");
    await mobile.screenshot({
      path: `${output}/home-${label}.png`,
      fullPage: true,
    });
    assert.equal(
      await mobile.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
      `${label}: no horizontal overflow`,
    );
    await mobile.goto(`${url}/minorista?categoria=pizzas`);
    await mobile
      .locator("article#pizza-muzzarella")
      .getByRole("button", { name: "+ Agregar", exact: true })
      .click();
    await mobile
      .locator("#carrito")
      .getByRole("link", { name: /Revisar y finalizar/ })
      .click();
    await mobile.waitForURL("**/pedido/minorista");
    await mobile
      .getByLabel("Nombre y apellido", { exact: false })
      .fill("Cliente Móvil");
    await mobile
      .getByLabel("Número de teléfono", { exact: false })
      .fill("3817654321");
    await mobile
      .getByLabel("Tipo de pedido", { exact: false })
      .selectOption("particular");
    await interceptWhatsApp(mobile);
    await mobile
      .getByRole("button", { name: "Enviar pedido por WhatsApp", exact: true })
      .click();
    assert.match(
      await mobile.evaluate(() => window.__hamdanOrderUrl),
      /^https:\/\/wa.me\//,
    );
    assert.equal(
      await mobile.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
    );
    await mobile.screenshot({
      path: `${output}/checkout-${label}.png`,
      fullPage: true,
    });
    console.log(
      `PASS ${label}: home, store, checkout and WhatsApp (emulated viewport).`,
    );
    await mobileContext.close();
  }
  // Opt in only when the WebKit runtime is installed.
  if (process.env.HAMDAN_TEST_WEBKIT === "1") {
    const safari = await webkit.launch({ headless: true });
    const iphone = await safari.newPage({ ...devices["iPhone 13"] });
    iphone.on("pageerror", (error) => errors.push(error.message));
    await iphone.goto(`${url}/minorista?categoria=pizzas`);
    await iphone
      .locator("article#pizza-muzzarella")
      .getByRole("button", { name: "+ Agregar", exact: true })
      .click();
    await iphone
      .locator("#carrito")
      .getByRole("link", { name: /Revisar y finalizar/ })
      .click();
    await iphone
      .getByLabel("Nombre y apellido", { exact: false })
      .fill("Cliente Safari");
    await iphone
      .getByLabel("Número de teléfono", { exact: false })
      .fill("3817654321");
    await iphone
      .getByLabel("Tipo de pedido", { exact: false })
      .selectOption("particular");
    await interceptWhatsApp(iphone);
    await iphone
      .getByRole("button", { name: "Enviar pedido por WhatsApp", exact: true })
      .click();
    assert.match(
      await iphone.evaluate(() => window.__hamdanOrderUrl),
      /^https:\/\/wa.me\//,
    );
    assert.equal(
      await iphone.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
    );
    await iphone.screenshot({
      path: `${output}/checkout-webkit.png`,
      fullPage: true,
    });
    await safari.close();
    console.log("PASS WebKit: checkout and WhatsApp at iPhone viewport.");
  }
  assert.deepEqual(errors, [], "No browser runtime errors");
} finally {
  await browser.close();
}
