import type { StoreMode } from "../data/catalog";
import { business } from "../data/business";
import { catalogCategories, wholesaleMinimums } from "../data/catalog";
import type { CatalogCategories, CatalogMinimums } from "./catalog";
import {
  calculateOrderTotal,
  formatARS,
  getWholesaleMinimums,
  productLabel,
  type OrderLine,
} from "./order";

export const orderTypes = [
  {
    value: "gastronomia",
    label: "Bar / Restaurante",
    detailLabel: "Nombre del bar o restaurante",
    messageLabel: "Bar / Restaurante",
  },
  {
    value: "comercio",
    label: "Comercio / Almacén / Kiosco",
    detailLabel: "Nombre del comercio",
    messageLabel: "Comercio",
  },
  {
    value: "evento",
    label: "Fiesta / Reunión / Evento",
    detailLabel: "Nombre o referencia del evento",
    messageLabel: "Evento",
  },
  {
    value: "particular",
    label: "Particular",
    detailLabel: "",
    messageLabel: "",
  },
] as const;

export type CheckoutData = {
  fullName: string;
  phone: string;
  orderType: "" | (typeof orderTypes)[number]["value"];
  businessName: string;
  taxId: string;
  email: string;
  notes: string;
  delivery: "envio" | "retiro";
  address: string;
  locality: string;
  reference: string;
};

export const emptyCheckout: CheckoutData = {
  fullName: "",
  phone: "",
  orderType: "",
  businessName: "",
  taxId: "",
  email: "",
  notes: "",
  delivery: "retiro",
  address: "",
  locality: "",
  reference: "",
};

export type CheckoutErrors = Partial<Record<keyof CheckoutData, string>>;
export type CheckoutValidation = {
  valid: boolean;
  fields: CheckoutErrors;
  cart: string[];
};

export function validateCheckout(
  data: CheckoutData,
  lines: readonly OrderLine[],
  mode: StoreMode,
  categories: CatalogCategories = catalogCategories,
  minimums: CatalogMinimums = wholesaleMinimums,
): CheckoutValidation {
  const fields: CheckoutErrors = {};
  const fullName = data.fullName.trim();
  const nameParts = fullName.split(/\s+/);
  if (
    fullName.length > 120 ||
    nameParts.length < 2 ||
    nameParts.some((part) => !/\p{L}/u.test(part)) ||
    !/^[\p{L}\p{M}\s.'’\-]+$/u.test(fullName)
  ) {
    fields.fullName = "Ingresá tu nombre y apellido completos.";
  }
  const phone = data.phone.trim();
  const digits = phone.replace(/\D/g, "");
  if (
    !/^\+?[\d\s().-]+$/.test(phone) ||
    digits.length < 10 ||
    digits.length > 15 ||
    /^(\d)\1+$/.test(digits)
  ) {
    fields.phone =
      "Ingresá un teléfono válido con código de área (10 a 15 dígitos).";
  }
  const orderType = orderTypes.find((type) => type.value === data.orderType);
  if (!orderType) fields.orderType = "Seleccioná el tipo de pedido.";
  if (
    orderType?.detailLabel &&
    (data.businessName.trim().length < 2 || data.businessName.length > 120)
  ) {
    fields.businessName = `Completá ${orderType.detailLabel.toLowerCase()}.`;
  }
  // Tax ID is optional for every order in this frontend stage.
  if (
    data.email.trim() &&
    (data.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
  ) {
    fields.email = "Revisá el correo electrónico o dejá el campo vacío.";
  }
  if (data.delivery !== "envio" && data.delivery !== "retiro")
    fields.delivery = "Elegí envío o retiro del local.";
  if (data.delivery === "envio" && data.address.trim().length < 5) {
    fields.address = "Ingresá la dirección completa para el envío.";
  }
  const cart: string[] = [];
  if (lines.some((line) => line.mode !== mode))
    cart.push(
      "El pedido contiene productos de otra tienda. Volvé al catálogo correspondiente.",
    );
  if (lines.length === 0)
    cart.push("Agregá productos para preparar tu pedido.");
  if (
    lines.some(
      (line) =>
        line.quantityError ||
        !Number.isFinite(line.quantity) ||
        line.quantity <= 0,
    )
  ) {
    cart.push("Revisá las cantidades indicadas en tu pedido.");
  }
  for (const minimum of getWholesaleMinimums(mode, lines, categories, minimums)) {
    if (minimum.missing > 0)
      cart.push(
        `${minimum.label}: faltan ${minimum.missing} ${minimum.unit} para llegar al mínimo de ${minimum.minimum}.`,
      );
  }
  return {
    valid: Object.keys(fields).length === 0 && cart.length === 0,
    fields,
    cart,
  };
}

// Customer input belongs inside labelled sections; line breaks in single-line fields are normalized.
function singleLine(value: string): string {
  return value.trim().replace(/[\r\n]+/g, " ");
}

export function buildWhatsAppMessage(
  data: CheckoutData,
  lines: readonly OrderLine[],
  mode: StoreMode,
  categories: CatalogCategories = catalogCategories,
  minimums: CatalogMinimums = wholesaleMinimums,
): string {
  if (!validateCheckout(data, lines, mode, categories, minimums).valid)
    throw new Error("El pedido todavía tiene datos pendientes.");
  const orderType = orderTypes.find((type) => type.value === data.orderType)!;
  const numberFormatter = new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 3,
  });
  const customer = [
    "DATOS DEL CLIENTE",
    `Nombre y apellido: ${singleLine(data.fullName)}`,
    `Teléfono: ${singleLine(data.phone)}`,
    `Tipo de pedido: ${orderType.label}`,
    ...(orderType.detailLabel
      ? [`${orderType.messageLabel}: ${singleLine(data.businessName)}`]
      : []),
    ...(data.taxId.trim() ? [`DNI/CUIT/CUIL: ${singleLine(data.taxId)}`] : []),
    ...(data.email.trim() ? [`Correo: ${singleLine(data.email)}`] : []),
  ];
  const delivery =
    data.delivery === "retiro"
      ? [
          "ENTREGA",
          "Modalidad: Retiro del local",
          `Retiro en: ${business.address}, ${business.city}`,
        ]
      : [
          "ENTREGA",
          "Modalidad: Envío",
          `Dirección: ${singleLine(data.address)}`,
          ...(data.locality.trim()
            ? [`Localidad / zona: ${singleLine(data.locality)}`]
            : []),
          ...(data.reference.trim()
            ? [`Referencia: ${singleLine(data.reference)}`]
            : []),
        ];
  return [
    `Hola Hamdan, quisiera realizar un pedido ${mode}.`,
    customer.join("\n"),
    `PEDIDO\n${lines.map((line) => `- ${numberFormatter.format(line.quantity)} × ${productLabel(line.product, categories)}\n  ${formatARS(line.unitPrice)} c/u — Subtotal: ${formatARS(line.subtotal)}`).join("\n\n")}`,
    `TOTAL ESTIMADO: ${formatARS(calculateOrderTotal(lines))}`,
    delivery.join("\n"),
    ...(data.notes.trim() ? [`OBSERVACIONES\n${data.notes.trim()}`] : []),
    "¿Me confirman disponibilidad y total final? Gracias.",
  ].join("\n\n");
}
