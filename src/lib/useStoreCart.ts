"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { StoreMode } from "@/data/catalog";
import { getCartSnapshot, getServerCartSnapshot, subscribeToCart, updateStoreCart } from "@/lib/storeCart";

export function useStoreCart(mode: StoreMode) {
  const subscribe = useCallback((onChange: () => void) => subscribeToCart(mode, onChange), [mode]);
  const getSnapshot = useCallback(() => getCartSnapshot(mode), [mode]);
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerCartSnapshot);

  function toggleProduct(id: string) {
    updateStoreCart(mode, (current) => {
      const removing = current.selected.includes(id);
      const quantities = { ...current.quantities };
      if (removing) delete quantities[id];
      else quantities[id] = "1";
      return {
        selected: removing ? current.selected.filter((item) => item !== id) : [...current.selected, id],
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
      return { selected: current.selected.filter((item) => item !== id), quantities };
    });
  }

  function clearCart() {
    updateStoreCart(mode, () => ({ selected: [], quantities: {} }));
  }

  return { ...cart, toggleProduct, setQuantity, removeProduct, clearCart };
}
