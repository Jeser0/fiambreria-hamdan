"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BasketIcon } from "./Icons";
import { useStoreCart } from "@/lib/useStoreCart";

export default function OrderCartButton() {
  const pathname = usePathname();
  const mode =
    pathname.startsWith("/minorista") || pathname === "/pedido/minorista"
      ? "minorista"
      : pathname.startsWith("/mayorista") || pathname === "/pedido/mayorista"
        ? "mayorista"
        : null;
  const wholesale = useStoreCart("mayorista");
  const retail = useStoreCart("minorista");
  const wholesaleCount = wholesale.selected.length;
  const retailCount = retail.selected.length;
  const count =
    mode === "mayorista"
      ? wholesaleCount
      : mode === "minorista"
        ? retailCount
        : wholesaleCount + retailCount;
  const [pulse, setPulse] = useState(false);
  const previousCount = useRef(count);

  useEffect(() => {
    const increased = count > previousCount.current;
    previousCount.current = count;
    if (!increased) return;
    const frame = window.requestAnimationFrame(() => setPulse(true));
    const timer = window.setTimeout(() => setPulse(false), 420);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [count]);

  const href =
    pathname.startsWith("/pedido/") && mode
      ? `/pedido/${mode}#carrito`
      : mode
        ? `/${mode}#carrito`
        : retailCount > 0 && wholesaleCount === 0
          ? "/minorista#carrito"
          : wholesaleCount > 0 && retailCount === 0
            ? "/mayorista#carrito"
            : "/#tiendas";
  return (
    <Link
      href={href}
      className="cart-board soft-press relative flex items-center gap-2 px-4 py-2.5 text-sm font-black text-[#1f1a13] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(111,78,24,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8f1f23] focus-visible:ring-offset-2"
      aria-label={
        mode
          ? `Abrir carrito ${mode}. ${count} productos seleccionados`
          : `Ver pedidos. ${wholesaleCount} productos mayoristas y ${retailCount} productos minoristas`
      }
    >
      <BasketIcon size={20} />
      <span className="hidden sm:inline">
        {mode ? "Mi pedido" : "Mis pedidos"}
      </span>
      <span
        className={`absolute -right-1 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#fff7d1] bg-[#9f1720] px-1 text-xs text-white ${pulse ? "cart-count-pulse" : ""}`}
      >
        {count}
      </span>
    </Link>
  );
}
