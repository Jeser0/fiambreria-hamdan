import assert from "node:assert/strict";
import test from "node:test";
import { catalogProducts } from "../src/data/catalog";
import { business, whatsappUrl } from "../src/data/business";
import {
  buildOrderLines,
  calculateOrderTotal,
  formatARS,
  getWholesaleMinimums,
  parseQuantity,
} from "../src/lib/order";
import {
  buildWhatsAppMessage,
  emptyCheckout,
  orderTypes,
  validateCheckout,
  type CheckoutData,
} from "../src/lib/checkout";
import { sanitizeSelection } from "../src/lib/storeCart";

const customer: CheckoutData = {
  ...emptyCheckout,
  fullName: "Juan Pérez",
  phone: "381 123 4567",
  orderType: "particular",
};
const ids = [
  "sandwich-x4-jamon-queso",
  "sandwich-x4-salame-queso",
  "pizza-muzzarella",
];
const quantities = { [ids[0]]: "100", [ids[1]]: "50", [ids[2]]: "20" };
const wholesale = buildOrderLines("mayorista", ids, quantities);
const retail = buildOrderLines("minorista", ids, quantities);

test("catalog prices produce the requested wholesale subtotals and total", () => {
  assert.deepEqual(
    wholesale.map((line) => line.subtotal),
    [225000, 112500, 100000],
  );
  assert.equal(calculateOrderTotal(wholesale), 437500);
  assert.equal(formatARS(225000), "$ 225.000");
});

test("retail prices stay separate and products without a wholesale price cannot leak in", () => {
  assert.equal(calculateOrderTotal(retail), 815000);
  assert.throws(() => buildWhatsAppMessage(customer, wholesale, "minorista"));
  assert.throws(() =>
    buildWhatsAppMessage(customer, [...wholesale, ...retail], "mayorista"),
  );
  assert.deepEqual(
    retail.map((line) => line.unitPrice),
    [4500, 4500, 7000],
  );
  const retailOnly = "sandwich-x8-pollo-huevo-queso-morron";
  assert.equal(
    buildOrderLines("mayorista", [retailOnly], { [retailOnly]: "40" }).length,
    0,
  );
  assert.equal(
    buildOrderLines("minorista", [retailOnly], { [retailOnly]: "1" })[0]
      .unitPrice,
    11000,
  );
});

test("quantities, additions, removals and clearing recalculate from the current selection", () => {
  assert.equal(
    calculateOrderTotal(
      buildOrderLines("mayorista", ids, { ...quantities, [ids[0]]: "101" }),
    ),
    439750,
  );
  assert.equal(
    calculateOrderTotal(
      buildOrderLines("mayorista", ids.slice(0, 2), quantities),
    ),
    337500,
  );
  assert.equal(
    calculateOrderTotal(buildOrderLines("mayorista", [], quantities)),
    0,
  );
  assert.equal(
    calculateOrderTotal(
      buildOrderLines("mayorista", [ids[0], ids[0]], quantities),
    ),
    225000,
  );
});

test("wholesale minimums sum varieties within each selected category", () => {
  const mixed = [ids[0], ids[1], "sandwich-x4-ternera-queso"];
  const complete = buildOrderLines("mayorista", mixed, {
    [mixed[0]]: "10",
    [mixed[1]]: "5",
    [mixed[2]]: "5",
  });
  assert.equal(getWholesaleMinimums("mayorista", complete)[0].missing, 0);
  const incomplete = buildOrderLines("mayorista", mixed, {
    [mixed[0]]: "10",
    [mixed[1]]: "5",
    [mixed[2]]: "4",
  });
  assert.equal(getWholesaleMinimums("mayorista", incomplete)[0].missing, 1);
  assert.equal(
    validateCheckout(customer, incomplete, "mayorista").valid,
    false,
  );
  const retailMixed = buildOrderLines("minorista", mixed, {
    [mixed[0]]: "10",
    [mixed[1]]: "5",
    [mixed[2]]: "4",
  });
  assert.equal(
    validateCheckout(customer, retailMixed, "minorista").valid,
    true,
  );
});

test("x8 and pizza minimums are independent and do not apply to retail", () => {
  const selection = [
    "sandwich-x8-jamon-queso",
    "sandwich-x8-salame-queso",
    "pizza-muzzarella",
    "pizza-jamon",
  ];
  const lines = buildOrderLines("mayorista", selection, {
    [selection[0]]: "20",
    [selection[1]]: "19",
    [selection[2]]: "10",
    [selection[3]]: "9",
  });
  assert.deepEqual(
    getWholesaleMinimums("mayorista", lines).map((item) => item.missing),
    [1, 1],
  );
  assert.deepEqual(getWholesaleMinimums("minorista", lines), []);
});

test("reject zero, negative, non-finite, exponent and fractional packaged quantities", () => {
  for (const quantity of [
    "",
    "0",
    "-1",
    "NaN",
    "Infinity",
    "1e2",
    "1.2.3",
    "1000000",
    "1,5",
  ]) {
    const invalid = buildOrderLines("minorista", [ids[0]], {
      [ids[0]]: quantity,
    });
    assert.equal(
      validateCheckout(customer, invalid, "minorista").valid,
      false,
      quantity,
    );
    assert.equal(calculateOrderTotal(invalid), 0);
  }
  assert.equal(parseQuantity("0,125"), 0.125);
  const weighed = buildOrderLines("minorista", ["cremoso-san-blas"], {
    "cremoso-san-blas": "0,125",
  });
  assert.equal(calculateOrderTotal(weighed), 1125);
});

test("empty carts cannot be sent and optional tax ID/email do not block a particular order", () => {
  assert.equal(validateCheckout(customer, wholesale, "mayorista").valid, true);
  assert.equal(validateCheckout(customer, [], "minorista").valid, false);
  assert.throws(() => buildWhatsAppMessage(customer, [], "mayorista"));
});

test("customer validation reports each required field and malformed optional email", () => {
  const errors = validateCheckout(
    {
      ...customer,
      fullName: "Juan",
      phone: "abc3811234567",
      orderType: "",
      email: "invalido",
    },
    wholesale,
    "mayorista",
  ).fields;
  assert.deepEqual(Object.keys(errors), [
    "fullName",
    "phone",
    "orderType",
    "email",
  ]);
  for (const phone of ["123", "0000000000", "1111111111", "1234567890123456"])
    assert.ok(
      validateCheckout({ ...customer, phone }, wholesale, "mayorista").fields
        .phone,
    );
  assert.equal(
    validateCheckout(
      {
        ...customer,
        fullName: "María José O’Connor",
        phone: "+54 (381) 123-4567",
      },
      wholesale,
      "mayorista",
    ).valid,
    true,
  );
});

test("business and event names are required only for the matching order types", () => {
  for (const type of orderTypes.filter((item) => item.value !== "particular")) {
    assert.ok(
      validateCheckout(
        { ...customer, orderType: type.value },
        wholesale,
        "mayorista",
      ).fields.businessName,
    );
    assert.equal(
      validateCheckout(
        { ...customer, orderType: type.value, businessName: "San Martín" },
        wholesale,
        "mayorista",
      ).valid,
      true,
    );
  }
});

test("delivery requires an address; pickup omits stale address, locality and reference", () => {
  assert.ok(
    validateCheckout({ ...customer, delivery: "envio" }, wholesale, "mayorista")
      .fields.address,
  );
  const message = buildWhatsAppMessage(
    {
      ...customer,
      address: "Dirección anterior 123",
      locality: "Zona anterior",
      reference: "Referencia anterior",
      businessName: "Comercio anterior",
    },
    wholesale,
    "mayorista",
  );
  assert.match(message, /Modalidad: Retiro del local/);
  assert.ok(
    message.includes(`Retiro en: ${business.address}, ${business.city}`),
  );
  for (const excluded of [
    "Dirección:",
    "Localidad / zona:",
    "Referencia:",
    "Correo:",
    "DNI/CUIT/CUIL:",
    "OBSERVACIONES",
    "Comercio anterior",
  ])
    assert.ok(!message.includes(excluded), excluded);
});

test("WhatsApp includes all nonempty fields, line subtotals, mode and delivery", () => {
  const data: CheckoutData = {
    ...customer,
    orderType: "comercio",
    businessName: "Almacén San Martín & Hijos",
    delivery: "envio",
    address: "Calle 123",
    locality: "Yerba Buena",
    reference: "Portón verde",
    email: "juan@example.com",
    taxId: "20-12345678-9",
    notes: "Entregar por la tarde 🧀\nGracias.",
  };
  const message = buildWhatsAppMessage(data, wholesale, "mayorista");
  for (const included of [
    "pedido mayorista",
    "100 × Sándwich x4 — Jamón y queso",
    "$ 2.250 c/u — Subtotal: $ 225.000",
    "TOTAL ESTIMADO: $ 437.500",
    "Comercio: Almacén San Martín & Hijos",
    "Correo: juan@example.com",
    "DNI/CUIT/CUIL: 20-12345678-9",
    "Dirección: Calle 123",
    "Localidad / zona: Yerba Buena",
    "Referencia: Portón verde",
    "OBSERVACIONES\nEntregar por la tarde 🧀\nGracias.",
  ])
    assert.ok(message.includes(included), included);
  const url = new URL(whatsappUrl(message));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, `/${business.whatsappNumber}`);
  assert.equal(url.searchParams.get("text"), message);
  assert.match(
    buildWhatsAppMessage(customer, retail, "minorista"),
    /pedido minorista/,
  );
});

test("persisted selection is deduplicated and rejects inactive, unknown or wrong-store items", () => {
  const active = catalogProducts[0].id;
  assert.deepEqual(
    sanitizeSelection(
      [
        active,
        active,
        "missing",
        23,
        null,
        "sandwich-x8-pollo-huevo-queso-morron",
      ],
      "mayorista",
    ),
    [active],
  );
  assert.deepEqual(sanitizeSelection({ wrong: true }, "minorista"), []);
});
