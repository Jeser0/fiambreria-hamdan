import { BasketIcon, BoxIcon, CardIcon, SparkIcon, WhatsAppIcon } from "./Icons";

export default function OrderExperience() {
  return (
    <section id="mayorista" className="scroll-mt-40 bg-[#fff7e8] py-14 lg:py-16">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-5 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
        <div className="wood-card relative overflow-hidden rounded-[2rem] p-7 text-[#fff7e5] shadow-[0_20px_45px_rgba(82,29,23,0.16)] sm:p-9">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#f5ca63]/20" />
          <div className="absolute right-12 top-12 text-[#f6c65a]/70"><SparkIcon size={24} /></div>
          <div className="relative grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f2c86c]">Hamdan Distribuciones</p>
              <h2 className="font-display mt-3 text-4xl font-black leading-none sm:text-5xl">Pedidos por mayor</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#f8e7cf]/80 sm:text-base">
                Una sección pensada para comercios, despensas, almacenes, autoservicios y gastronomía. Consultá disponibilidad y precios mayoristas sin mezclarlo con la compra minorista.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
                {['Precios especiales', 'Atención personalizada', 'Quesos y alimentos', 'Pedidos organizados'].map((label) => (
                  <span key={label} className="rounded-full border border-white/15 bg-white/10 px-3 py-2">✓ {label}</span>
                ))}
              </div>
            </div>
            <div className="flex min-w-52 flex-col gap-3">
              <a href="https://wa.me/543813514449" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f2c65f] px-5 py-3.5 text-sm font-black text-[#4a2a1c] transition hover:-translate-y-0.5 hover:bg-[#f7d47d]">
                <WhatsAppIcon size={19} /> Consultar mayorista
              </a>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-black text-white transition hover:bg-white/15">
                <BoxIcon size={18} /> Ver sección mayorista
              </button>
            </div>
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-[2rem] bg-[#8f1c23] p-7 text-white shadow-[0_20px_45px_rgba(105,25,28,0.16)] sm:p-8">
          <SparkIcon size={18} className="absolute right-8 top-7 text-[#f1c85d]" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#efc663]">Compra online</p>
              <h2 className="font-display mt-2 text-3xl font-black leading-none">Tu pedido, a un clic</h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4ca63] text-[#6b241d] shadow-inner"><BasketIcon size={28} /></div>
          </div>
          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3"><CardIcon size={18} className="text-[#f2c75f]" /><span>Pago online con Mercado Pago</span></div>
            <div className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3"><span className="text-[#f2c75f]">✓</span><span>Transferencia bancaria</span></div>
            <div className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3"><WhatsAppIcon size={18} className="text-[#f2c75f]" /><span>También podés coordinar por WhatsApp</span></div>
          </div>
          <p className="handwritten mt-6 rotate-[-2deg] text-right text-lg font-bold text-[#f5d384]">Del local a tu mesa ♥</p>
        </aside>
      </div>
    </section>
  );
}
