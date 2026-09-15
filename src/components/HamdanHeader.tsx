import Image from "next/image";
import { BasketIcon, SearchIcon, UserIcon, WhatsAppIcon } from "./Icons";

const navItems = [
  ["Inicio", "#inicio"],
  ["Quiénes somos", "#historia"],
  ["Fiambres", "#secciones"],
  ["Lácteos", "#secciones"],
  ["Alimentos", "#secciones"],
  ["Mayorista", "#mayorista"],
  ["Cómo pedir", "#como-pedir"],
  ["Contacto", "#contacto"],
] as const;

export default function HamdanHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#7a221f]/10 bg-[#fffaf0]/95 shadow-[0_8px_30px_rgba(72,32,18,0.08)] backdrop-blur-xl">
      <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-6">
          <a href="#inicio" className="flex shrink-0 items-center gap-3" aria-label="Fiambrería Hamdan, inicio">
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
          </a>

          <div className="min-w-0 flex-1">
            <nav className="hidden items-center justify-center gap-5 text-[13px] font-bold text-[#4b362d] xl:flex">
              {navItems.map(([label, href], index) => (
                <a
                  key={label}
                  href={href}
                  className={`relative whitespace-nowrap py-1 transition hover:text-[#8f1f23] ${index === 0 ? "text-[#8f1f23] after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-[#8f1f23]" : ""}`}
                >
                  {label}
                </a>
              ))}
            </nav>

            <label className="mx-auto mt-0 flex max-w-2xl items-center gap-3 rounded-full border border-[#6f1719]/15 bg-white/80 px-4 py-2.5 text-sm text-[#7d6b60] shadow-inner xl:mt-2">
              <SearchIcon size={18} className="shrink-0 text-[#5e4033]" />
              <input
                type="search"
                placeholder="¿Qué querés hoy?"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#9c8c82]"
                aria-label="Buscar en Fiambrería Hamdan"
              />
            </label>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-xl border border-[#8f1f23]/20 bg-white px-3.5 py-2.5 text-sm font-bold text-[#7f2425] transition hover:-translate-y-0.5 hover:shadow-md md:flex"
            >
              <UserIcon size={18} />
              <span className="hidden lg:inline">Iniciar sesión</span>
            </button>

            <a
              href="https://wa.me/543813514449"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-xl bg-[#15975d] px-3.5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#118552] hover:shadow-md lg:flex"
            >
              <WhatsAppIcon size={19} />
              <span>Pedir por WhatsApp</span>
            </a>

            <button type="button" className="cart-board relative flex items-center gap-2 px-4 py-2.5 text-sm font-black text-[#fff6dc]" aria-label="Abrir mi pedido">
              <BasketIcon size={20} />
              <span className="hidden sm:inline">Mi pedido</span>
              <span className="absolute -right-1 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#fff6dc] bg-[#a51621] px-1 text-xs text-white">0</span>
            </button>
          </div>
        </div>

        <details className="mt-3 xl:hidden">
          <summary className="cursor-pointer list-none rounded-xl border border-[#7a221f]/10 bg-white/60 px-4 py-2 text-center text-sm font-bold text-[#6d2a24]">Secciones</summary>
          <nav className="mt-2 grid grid-cols-2 gap-2 rounded-2xl border border-[#7a221f]/10 bg-white p-3 text-sm font-semibold text-[#4b362d] shadow-lg sm:grid-cols-4">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} className="rounded-lg px-3 py-2 hover:bg-[#f5e7d4] hover:text-[#8f1f23]">{label}</a>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
