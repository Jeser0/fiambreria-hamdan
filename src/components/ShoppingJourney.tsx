import { BasketIcon, CardIcon, ClipboardIcon, StoreIcon, UserIcon } from "./Icons";

const steps = [
  { n: "1", title: "Ingresá o explorá", text: "Creá tu cuenta o navegá sin registrarte.", icon: <StoreIcon size={28} /> },
  { n: "2", title: "Elegí tus categorías", text: "Fiambres, lácteos, alimentos y más.", icon: <BasketIcon size={28} /> },
  { n: "3", title: "Armá tu pedido", text: "Agregá lo que necesitás y revisá tu carrito.", icon: <ClipboardIcon size={28} /> },
  { n: "4", title: "Pagá o coordiná", text: "Pago online, transferencia o WhatsApp.", icon: <CardIcon size={28} /> },
];

export default function ShoppingJourney() {
  return (
    <section id="como-pedir" className="paper-surface scroll-mt-40 py-14 lg:py-16">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-5 sm:px-6 lg:grid-cols-[0.7fr_2fr_0.8fr] lg:px-8">
        <div className="flex flex-col justify-center rounded-3xl border border-[#8f1f23]/10 bg-[#fff8eb]/80 p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b27624]">Comprar es simple</p>
          <h2 className="font-display mt-2 text-4xl font-black leading-[0.95] text-[#7f1c21]">Cómo comprar en Hamdan</h2>
          <p className="mt-4 text-sm leading-6 text-[#6e5a4f]">Es rápido, claro y sin vueltas. Elegí cómo querés comprar y nosotros te acompañamos.</p>
          <p className="handwritten mt-5 rotate-[-2deg] text-lg font-bold text-[#a56c21]">¡Hacé tu pedido en minutos! ↗</p>
        </div>

        <div className="rounded-3xl border border-[#8f1f23]/10 bg-white/80 p-5 shadow-[0_12px_28px_rgba(84,48,30,0.06)]">
          <div className="grid gap-3 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.n} className="relative rounded-2xl bg-[#fffaf0] p-4">
                {index < steps.length - 1 && <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-2xl text-[#c5ae98] md:block">→</span>}
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c68a1d] text-sm font-black text-white">{step.n}</span>
                  <span className="text-[#8f1f23]">{step.icon}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-black text-[#7b2022]">{step.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#76645a]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-[#8f1f23]/12 bg-[#f7ead7] p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#8f1f23] shadow-sm"><UserIcon size={22} /></div>
          <h3 className="font-display mt-4 text-2xl font-black text-[#7b2022]">Tu cuenta Hamdan</h3>
          <p className="mt-3 text-sm leading-6 text-[#68574e]">Iniciá sesión para guardar tus pedidos, ver tu historial y comprar más rápido.</p>
          <button type="button" className="mt-5 w-full rounded-xl border border-[#8f1f23]/20 bg-white px-4 py-3 text-sm font-black text-[#7f2023] transition hover:-translate-y-0.5 hover:shadow-md">Mi cuenta →</button>
        </aside>
      </div>
    </section>
  );
}
