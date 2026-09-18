"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BasketIcon } from "./Icons";

const STORAGE_KEY = "hamdan-wholesale-selection";

function readCount() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return 0;
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export default function OrderCartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(readCount());
    updateCount();

    window.addEventListener("storage", updateCount);
    window.addEventListener("hamdan-cart-updated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("hamdan-cart-updated", updateCount);
    };
  }, []);

  return (
    <Link
      href="/mayorista#consulta"
      className="cart-board relative flex items-center gap-2 px-4 py-2.5 text-sm font-black text-[#1f1a13] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(111,78,24,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8f1f23] focus-visible:ring-offset-2"
      aria-label={`Abrir mi pedido. ${count} productos seleccionados`}
    >
      <BasketIcon size={20} />
      <span className="hidden sm:inline">Mi pedido</span>
      <span className="absolute -right-1 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#fff7d1] bg-[#9f1720] px-1 text-xs text-white">
        {count}
      </span>
    </Link>
  );
}
