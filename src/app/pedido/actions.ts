"use server";

import { getCatalogSnapshot } from "@/lib/catalog-db";
import { parseOrderRequest, prepareOrder } from "@/lib/prepare-order";

export async function prepareWhatsAppOrder(input: unknown) {
  try {
    const request = parseOrderRequest(input);
    return { ok: true as const, ...prepareOrder(await getCatalogSnapshot(), request) };
  } catch {
    return { ok: false as const, error: "No pudimos verificar tu pedido. Revisá los datos e intentá nuevamente." };
  }
}
