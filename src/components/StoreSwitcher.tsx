import Link from "next/link";
import type { StoreMode } from "@/data/catalog";

export default function StoreSwitcher({ mode }: { mode: StoreMode }) {
  return (
    <div className="inline-flex rounded-2xl border border-[#8f1f23]/12 bg-white/75 p-1.5 shadow-sm" aria-label="Elegir tienda">
      <Link
        href="/mayorista"
        className={`soft-press rounded-xl px-4 py-2.5 text-xs font-black transition ${mode === "mayorista" ? "bg-[#8f1f23] text-white shadow-sm" : "text-[#6f3c34] hover:bg-[#fff2d6]"}`}
      >
        Tienda mayorista
      </Link>
      <Link
        href="/minorista"
        className={`soft-press rounded-xl px-4 py-2.5 text-xs font-black transition ${mode === "minorista" ? "bg-[#8f1f23] text-white shadow-sm" : "text-[#6f3c34] hover:bg-[#fff2d6]"}`}
      >
        Tienda minorista
      </Link>
    </div>
  );
}
