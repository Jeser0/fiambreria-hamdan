"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { CatalogProduct, StoreMode } from "@/data/catalog";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeToCart,
  updateStoreCart,
  sanitizeSelection,
} from "@/lib/storeCart";

export function useStoreCart(
  mode: StoreMode,
  catalog?: readonly CatalogProduct[],
) {
  const subscribe = useCallback(
    (onChange: () => void) => subscribeToCart(mode, onChange),
    [mode],
  );
  const getSnapshot = useCallback(() => getCartSnapshot(mode), [mode]);
  const cart = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerCartSnapshot,
  );

  useEffect(() => {
    if (!catalog || !cart.loaded) return;
    const selected = sanitizeSelection(cart.selected, mode, catalog);
    if (selected.length !== cart.selected.length) {
      updateStoreCart(mode, (current) => ({
        selected: sanitizeSelection(current.selected, mode, catalog),
        quantities: current.quantities,
      }));
    }
  }, [catalog, cart.loaded, cart.selected, mode]);

  function toggleProduct(id: string) {
    if (catalog && !sanitizeSelection([id], mode, catalog).length) return;
    updateStoreCart(mode, (current) => {
      const removing = current.selected.includes(id);
      const quantities = { ...current.quantities };
      if (removing) delete quantities[id];
      else quantities[id] = "1";
      return {
        selected: removing
          ? current.selected.filter((item) => item !== id)
          : [...current.selected, id],
        quantities,
      };
    });
  }

  function setQuantity(id: string, value: string) {
    updateStoreCart(mode, (current) => ({
      selected: current.selected,
      quantities: { ...current.quantities, [id]: value.slice(0, 12) },
    }));
  }

  function removeProduct(id: string) {
    updateStoreCart(mode, (current) => {
      const quantities = { ...current.quantities };
      delete quantities[id];
      return {
        selected: current.selected.filter((item) => item !== id),
        quantities,
      };
    });
  }

  function clearCart() {
    updateStoreCart(mode, () => ({ selected: [], quantities: {} }));
  }

  return {
    ...cart,
    selected: catalog
      ? sanitizeSelection(cart.selected, mode, catalog)
      : cart.selected,
    toggleProduct,
    setQuantity,
    removeProduct,
    clearCart,
  };
}
