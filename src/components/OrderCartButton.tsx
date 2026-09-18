"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BasketIcon } from "./Icons";
import { type StoreMode } from "@/data/catalog";
import { STORE_CART_UPDATED_EVENT, readStoredSelection } from "@/lib/storeCart";

function modeFromPath(pathname: string): StoreMode | null {
  if (pathname.startsWith("/minorista")) return "minorista";
  if (pathname.startsWith("/mayorista")) return "mayorista";
  return null;
}

export default function OrderCartButton() {
  const pathname = usePathname();
  const mode = modeFromPath(pathname);
  const [wholesaleCount, setWholesaleCount] = useState(0);
  const [retailCount, setRetailCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const previousCount = useRef(0);
  const pulseTimer = useRef<number | null>(null);

  const count = mode === "mayorista" ? wholesaleCount : mode === "minorista" ? retailCount : wholesaleCount + retailCount;

  useEffect(() => {
    const updateCount = () => {
      const nextWholesale = readStoredSelection("mayorista").length;
      const nextRetail = readStoredSelection("minorista").length;
      const nextCount = mode === "mayorista" ? nextWholesale : mode === "minorista" ? nextRetail : nextWholesale + nextRetail;

      if (nextCount > previousCount.current) {
        if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
        setPulse(false);
        window.requestAnimationFrame(() => setPulse(true));
        pulseTimer.current = window.setTimeout(() => setPulse(false), 420);
      }

      previousCount.current = nextCount;
      setWholesaleCount(nextWholesale);
      setRetailCount(nextRetail);
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener(STORE_CART_UPDATED_EVENT, updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener(STORE_CART_UPDATED_EVENT, updateCount);
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
    };
  }, [mode]);

  const href = useMemo(() => {
    if (mode === "minorista") return "/minorista#carrito";
    if (mode === "mayorista") return "/mayorista#carrito";
    if (retailCount > 0 && wholesaleCount === 0) return "/minorista#carrito";
    if (wholesaleCount > 0 && retailCount === 0) return "/mayorista#carrito";
    return "/#tiendas";
  }, [mode, retailCount, wholesaleCount]);

  const visibleLabel = mode ? "Mi pedido" : "Mis pedidos";
  const ariaLabel = mode
    ? `Abrir carrito ${mode}. ${count} productos seleccionados`
    : `Ver pedidos. ${wholesaleCount} productos mayoristas y ${retailCount} productos minoristas`;

  return (
    <Link
      href={href}
      className="cart-board soft-press relative flex items-center gap-2 px-4 py-2.5 text-sm font-black text-[#1f1a13] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(111,78,24,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8f1f23] focus-visible:ring-offset-2"
      aria-label={ariaLabel}
    >
      <BasketIcon size={20} />
      <span className="hidden sm:inline">{visibleLabel}</span>
      <span className={`absolute -right-1 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#fff7d1] bg-[#9f1720] px-1 text-xs text-white ${pulse ? "cart-count-pulse" : ""}`}>
        {count}
      </span>
    </Link>
  );
}
