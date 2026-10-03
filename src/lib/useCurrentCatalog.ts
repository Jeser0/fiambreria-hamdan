"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { catalogMinimums, type CatalogSnapshot } from "./catalog";

export function useCurrentCatalog(initial: CatalogSnapshot) {
  const [snapshot, updateSnapshot] = useState(initial);
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    try {
      const response = await fetch("/api/catalog", {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Catálogo no disponible");
      const next: CatalogSnapshot = await response.json();
      if (!controller.signal.aborted) {
        updateSnapshot((current) =>
          JSON.stringify(current) === JSON.stringify(next) ? current : next,
        );
        setError("");
      }
    } catch {
      if (!controller.signal.aborted)
        setError(
          "No pudimos actualizar los precios. Intentá nuevamente antes de enviar tu pedido.",
        );
    }
  }, []);
  const setSnapshot = useCallback((next: CatalogSnapshot) => {
    request.current?.abort();
    updateSnapshot(next);
    setError("");
  }, []);
  useEffect(() => {
    const onFocus = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const timer = window.setInterval(onFocus, 30000);
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    const initialRefresh = window.setTimeout(onFocus, 0);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(initialRefresh);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      request.current?.abort();
    };
  }, [refresh]);
  return {
    snapshot,
    minimums: catalogMinimums(snapshot),
    error,
    refresh,
    setSnapshot,
  };
}
