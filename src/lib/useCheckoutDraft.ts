"use client";

import { useEffect, useState } from "react";
import type { StoreMode } from "@/data/catalog";
import { cartCustomerKey, cartNotesKey } from "@/lib/storeCart";
import { emptyCheckout, orderTypes, type CheckoutData } from "@/lib/checkout";

export function useCheckoutDraft(mode: StoreMode) {
  const [data, setData] = useState<CheckoutData>(emptyCheckout);
  const [ready, setReady] = useState(false);
  const key = `hamdan-${mode}-checkout-v1`;

  useEffect(() => {
    const draft = { ...emptyCheckout };
    try {
      const raw = window.sessionStorage.getItem(key);
      const saved: unknown = raw ? JSON.parse(raw) : null;
      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        for (const [field, value] of Object.entries(saved)) {
          if (typeof value !== "string") continue;
          if (field === "orderType")
            draft.orderType =
              orderTypes.find((item) => item.value === value)?.value ?? "";
          else if (field === "delivery")
            draft.delivery = value === "envio" ? "envio" : "retiro";
          else if (
            field === "fullName" ||
            field === "phone" ||
            field === "businessName" ||
            field === "taxId" ||
            field === "email" ||
            field === "notes" ||
            field === "address" ||
            field === "locality" ||
            field === "reference"
          ) {
            draft[field] = value.slice(0, field === "notes" ? 800 : 254);
          }
        }
      } else {
        draft.fullName = (
          window.localStorage.getItem(cartCustomerKey(mode)) ?? ""
        ).slice(0, 120);
        draft.notes = (
          window.localStorage.getItem(cartNotesKey(mode)) ?? ""
        ).slice(0, 800);
      }
    } catch {
      // Personal details are optional to persist; unavailable storage must not block an order.
    }
    const frame = window.requestAnimationFrame(() => {
      setData(draft);
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [key, mode]);

  function update<K extends keyof CheckoutData>(
    field: K,
    value: CheckoutData[K],
  ) {
    setData((current) => {
      const next = { ...current, [field]: value };
      // Write immediately so navigating back to the catalog never races an effect.
      try {
        window.sessionStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* Continue without a draft. */
      }
      return next;
    });
  }

  return { data, update, ready };
}
