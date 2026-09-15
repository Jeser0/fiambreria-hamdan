const categories = [
  {
    title: "Fiambres",
    description: "Jamón, paleta, salames, mortadela y más.",
    href: "#fiambres",
  },
  {
    title: "Lácteos",
    description: "Quesos, cremosos, barra, sardo y variedades.",
    href: "#lacteos",
  },
  {
    title: "Alimentos",
    description: "Sánguchitos, pizzas, picadas y más.",
    href: "#alimentos",
  },
];

const fiambres = [
  "Jamón Cocido",
  "Paleta Cocida",
  "Salame",
  "Mortadela Paladini",
];

const lacteos = [
  "Cremoso San Blas",
  "Barra Tybo",
  "X Salud",
  "Pategrás / Cáscara Roja",
];

const alimentos = [
  "Sánguchitos de miga",
  "Pizzas",
  "Picadas",
  "Promociones",
];

function ImagePlaceholder({ label = "Producto" }: { label?: string }) {
  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white text-sm font-medium text-stone-400">
      {label}
    </div>
  );
}

function ProductCard({ name }: { name: string }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <ImagePlaceholder />

      <div className="px-1 pb-1 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">
          Producto
        </p>

        <h3 className="mt-1 text-lg font-bold text-[#14271f]">{name}</h3>

        <p className="mt-1 text-sm text-stone-500">
          Precio y presentación a definir
        </p>

        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-[#173c2e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20533f]"
        >
          Consultar
        </button>
      </div>
    </article>
  );
}

function ProductSection({
  id,
  title,
  description,
  products,
}: {
  id: string;
  title: string;
  description: string;
  products: string[];
}) {
  return (
    <section id={id} className="scroll-mt-28 py-14">
      <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#947347]">
            Catálogo
          </p>

          <h2 className="mt-1 text-3xl font-black text-[#14271f]">{title}</h2>

          <p className="mt-2 max-w-2xl text-stone-600">{description}</p>
        </div>

        <button
          type="button"
          className="text-left text-sm font-bold text-[#173c2e] sm:text-right"
        >
          Ver todos →
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product} name={product} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f3eb] text-[#18231f]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#10251d] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xl font-black">
              H
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                Fiambrería
              </p>
              <p className="text-xl font-black tracking-wide">HAMDAN</p>
            </div>
          </a>

          <nav className="order-3 flex w-full gap-5 overflow-x-auto text-sm font-semibold text-white/80 lg:order-2 lg:w-auto">
            <a href="#inicio" className="hover:text-white">
              Inicio
            </a>
            <a href="#fiambres" className="hover:text-white">
              Fiambres
            </a>
            <a href="#lacteos" className="hover:text-white">
              Lácteos
            </a>
            <a href="#alimentos" className="hover:text-white">
              Alimentos
            </a>
            <a href="#mayorista" className="hover:text-white">
              Mayorista
            </a>
            <a href="#contacto" className="hover:text-white">
              Contacto
            </a>
          </nav>

          <div className="order-2 flex gap-2 lg:order-3">
            <a
              href="tel:+543812550960"
              className="hidden rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10 sm:block"
            >
              Llamar
            </a>

            <a
              href="https://wa.me/543813514449"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#2f865f] px-4 py-2 text-sm font-bold transition hover:bg-[#389d70]"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* HERO / QUIÉNES SOMOS */}
      <section
        id="inicio"
        className="scroll-mt-28 border-b border-stone-200 bg-[#efe7d9]"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.05fr_1fr_0.8fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#947347]">
              Quiénes somos
            </p>

            <h1 className="mt-3 text-4xl font-black leading-tight text-[#13271f] sm:text-5xl">
              Fiambrería Hamdan
            </h1>

            <p className="mt-2 text-xl font-semibold text-[#947347]">
              Desde 1992
            </p>

            <p className="mt-6 max-w-xl text-base leading-7 text-stone-700">
              Somos una fiambrería familiar de San Miguel de Tucumán,
              especializada en fiambres, quesos, lácteos, sándwiches, pizzas
              y atención a comercios.
            </p>

            <p className="mt-3 max-w-xl text-base leading-7 text-stone-600">
              Más de tres décadas acompañando a nuestros clientes con variedad,
              calidad y atención personalizada.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#categorias"
                className="rounded-xl bg-[#173c2e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#20533f]"
              >
                Ver productos
              </a>

              <a
                href="#mayorista"
                className="rounded-xl border border-[#173c2e]/20 bg-white/50 px-5 py-3 text-sm font-bold text-[#173c2e] transition hover:bg-white"
              >
                Pedidos por mayor
              </a>
            </div>
          </div>

          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border-2 border-dashed border-stone-300 bg-white/60 text-center text-stone-400">
            <div>
              <p className="font-bold">Foto principal del local</p>
              <p className="mt-1 text-sm">Imagen real pendiente</p>
            </div>
          </div>

          {/* INFO NEGOCIO */}
          <aside className="rounded-3xl bg-[#173c2e] p-7 text-white shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">
              Información
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Hamdan - Fiambres y Quesos
            </h2>

            <div className="mt-7 space-y-6 text-sm">
              <div>
                <p className="font-bold">Dirección</p>
                <p className="mt-1 text-white/70">
                  Av. Colón 340, San Miguel de Tucumán
                </p>
              </div>

              <div>
                <p className="font-bold">Teléfono</p>
                <p className="mt-1 text-white/70">+54 381 255 0960</p>
              </div>

              <div>
                <p className="font-bold">Pedidos mayoristas</p>
                <p className="mt-1 text-white/70">381 351 4449</p>
              </div>

              <div>
                <p className="font-bold">Horarios</p>
                <p className="mt-1 text-white/70">
                  Lun–Sáb 09:00–13:30
                  <br />
                  18:00–21:30
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-bold">4.6 ★ en Google</p>
                <p className="mt-1 text-xs text-white/60">
                  Tienda de fiambres
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section
        id="categorias"
        className="scroll-mt-28 bg-[#10251d] text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-7 md:grid-cols-3 lg:px-8">
          {categories.map((category) => (
            <a
              key={category.title}
              href={category.href}
              className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
            >
              <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/30 bg-white/5 text-xs text-white/40">
                Categoría
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold">{category.title}</h2>
                <p className="mt-1 text-sm leading-5 text-white/55">
                  {category.description}
                </p>
              </div>

              <span className="text-2xl transition group-hover:translate-x-1">
                →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* PRODUCTOS */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <ProductSection
          id="fiambres"
          title="Fiambres"
          description="Selección de fiambres para el hogar, comercios y gastronomía."
          products={fiambres}
        />

        <div className="border-t border-stone-200" />

        <ProductSection
          id="lacteos"
          title="Lácteos"
          description="Quesos y productos seleccionados para todos los días."
          products={lacteos}
        />

        <div className="border-t border-stone-200" />

        <ProductSection
          id="alimentos"
          title="Alimentos"
          description="Opciones listas para compartir, vender o disfrutar en casa."
          products={alimentos}
        />
      </div>

      {/* MAYORISTA */}
      <section
        id="mayorista"
        className="scroll-mt-28 bg-[#173c2e] text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d2b384]">
              Hamdan Distribuciones
            </p>

            <h2 className="mt-3 text-4xl font-black">Pedidos por mayor</h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
              Abastecemos despensas, almacenes, kioscos, autoservicios,
              supermercados y comercios gastronómicos.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                "Precios mayoristas",
                "Variedad de productos",
                "Atención personalizada",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-semibold"
                >
                  ✓ {item}
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/543813514449"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-xl bg-[#d7b57f] px-6 py-3 font-bold text-[#173c2e] transition hover:bg-[#e5c99e]"
            >
              Solicitar lista mayorista
            </a>
          </div>

          <div className="flex min-h-[280px] items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-white/5 text-center text-white/40">
            <div>
              <p className="font-bold">Imagen mayorista</p>
              <p className="mt-1 text-sm">Foto real pendiente</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="scroll-mt-28 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#947347]">
              Contacto
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#14271f]">
              Visitanos en Tucumán
            </h2>

            <div className="mt-8 space-y-5 text-stone-600">
              <div>
                <p className="font-bold text-[#14271f]">Dirección</p>
                <p>Av. Colón 340, San Miguel de Tucumán</p>
              </div>

              <div>
                <p className="font-bold text-[#14271f]">Teléfono</p>
                <p>+54 381 255 0960</p>
              </div>

              <div>
                <p className="font-bold text-[#14271f]">
                  WhatsApp mayorista
                </p>
                <p>381 351 4449</p>
              </div>

              <div>
                <p className="font-bold text-[#14271f]">Horarios</p>
                <p>Lunes a sábado</p>
                <p>09:00–13:30 · 18:00–21:30</p>
              </div>
            </div>
          </div>

          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border-2 border-dashed border-stone-300 bg-stone-50 text-center text-stone-400">
            <div>
              <p className="font-bold">Mapa</p>
              <p className="mt-1 text-sm">Google Maps pendiente</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0c1c16] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Fiambrería
            </p>
            <p className="mt-1 text-2xl font-black">HAMDAN</p>
            <p className="mt-3 text-sm text-white/50">
              Fiambres y quesos desde 1992.
            </p>
          </div>

          <div>
            <p className="font-bold">Enlaces</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-white/50">
              <a href="#inicio">Inicio</a>
              <a href="#fiambres">Fiambres</a>
              <a href="#lacteos">Lácteos</a>
              <a href="#alimentos">Alimentos</a>
              <a href="#mayorista">Mayorista</a>
            </div>
          </div>

          <div>
            <p className="font-bold">Contacto</p>
            <div className="mt-3 space-y-2 text-sm text-white/50">
              <p>Av. Colón 340</p>
              <p>San Miguel de Tucumán</p>
              <p>+54 381 255 0960</p>
              <p>WhatsApp mayorista: 381 351 4449</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-xs text-white/35">
          © 2026 Fiambrería Hamdan. Todos los derechos reservados.
        </div>
      </footer>
    </main>
  );
}