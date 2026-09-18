import Image from "next/image";
import Link from "next/link";
import { SearchIcon, WhatsAppIcon } from "./Icons";
import OrderCartButton from "./OrderCartButton";

const navItems = [
  ["Inicio", "/"],
  ["Quiénes somos", "/#historia"],
  ["Fiambres", "/mayorista?categoria=fiambres#catalogo"],
  ["Lácteos", "/mayorista?categoria=quesos#catalogo"],
  ["Alimentos", "/mayorista?categoria=alimentos#catalogo"],
  ["Mayorista", "/mayorista"],
  ["Cómo pedir", "/#como-pedir"],
  ["Contacto", "/#contacto"],
] as const;

export default function HamdanHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#7a221f]/10 bg-[#fffaf0]/95 shadow-[0_8px_30px_rgba(72,32,18,0.08)] backdrop-blur-xl">
      <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Fiambrería Hamdan, inicio">
            <Image
              src="/brand/logo.svg"
              alt="Logo Fiambrería Hamdan"
              width={78}
              height={78}
              className="h-14 w-14 rounded-full object-cover shadow-sm sm:h-16 sm:w-16"
              priority
            />
            <div className="hidden sm:block">
              <p className="font-display text-[1.15rem] font-bold leading-none text-[#3f2018]">Fiambrería</p>
              <p className="font-display text-[1.75rem] font-black leading-none tracking-tight text-[#6f1719]">HAMDAN</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#866a54]">Fiambres · Quesos · Mayorista</p>
            </div>
          </Link>

          <div className="min-w-0 flex-1">
            <nav className="hidden items-center justify-center gap-5 text-[13px] font-bold text-[#4b362d] xl:flex">
              {navItems.map(([label, href], index) => (
                <Link
                  key={label}
                  href={href}
                  className={`relative whitespace-nowrap py-1 transition hover:text-[#8f1f23] ${index === 0 ? "text-[#8f1f23] after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-[#8f1f23]" : ""}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <form action="/mayorista" className="mx-auto mt-0 flex max-w-2xl items-center gap-3 rounded-full border border-[#6f1719]/15 bg-white/80 px-4 py-2.5 text-sm text-[#7d6b60] shadow-inner xl:mt-2">
              <SearchIcon size={18} className="shrink-0 text-[#5e4033]" />
              <input
                name="q"
                type="search"
                placeholder="Buscar en el catálogo mayorista..."
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#9c8c82]"
                aria-label="Buscar en el catálogo mayorista de Fiambrería Hamdan"
              />
            </form>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href="https://wa.me/543813514449"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-xl border border-[#15975d]/40 bg-[#15975d]/12 px-3.5 py-2.5 text-sm font-black text-[#0b7145] shadow-sm transition hover:-translate-y-0.5 hover:border-[#15975d]/60 hover:bg-[#15975d]/18 hover:shadow-md lg:flex"
            >
              <WhatsAppIcon size={19} />
              <span>Pedir por WhatsApp</span>
            </a>

            <OrderCartButton />
          </div>
        </div>

        <details className="mt-3 xl:hidden">
          <summary className="cursor-pointer list-none rounded-xl border border-[#7a221f]/10 bg-white/60 px-4 py-2 text-center text-sm font-bold text-[#6d2a24]">Secciones</summary>
          <nav className="mt-2 grid grid-cols-2 gap-2 rounded-2xl border border-[#7a221f]/10 bg-white p-3 text-sm font-semibold text-[#4b362d] shadow-lg sm:grid-cols-4">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} className="rounded-lg px-3 py-2 hover:bg-[#f5e7d4] hover:text-[#8f1f23]">{label}</Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
