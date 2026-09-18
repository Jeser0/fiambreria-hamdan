"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BasketIcon, ClipboardIcon, WhatsAppIcon } from "./Icons";
import { wholesaleProducts } from "@/data/wholesale";
import {
  notifyOrderUpdated,
  ORDER_BUSINESS_KEY,
  ORDER_NOTES_KEY,
  ORDER_QUANTITIES_KEY,
  ORDER_SELECTION_KEY,
  readStoredQuantities,
  readStoredSelection,
  type QuantityMap,
} from "@/lib/wholesaleOrder";

export default function WholesaleOrderSummary() {
  const [selected, setSelected] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [businessName, setBusinessName] = useState("");
  const [notes, setNotes] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSelected(readStoredSelection());
      setQuantities(readStoredQuantities());
      setBusinessName((window.localStorage.getItem(ORDER_BUSINESS_KEY) ?? "").slice(0, 100));
      setNotes((window.localStorage.getItem(ORDER_NOTES_KEY) ?? "").slice(0, 800));
      setLoaded(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(ORDER_SELECTION_KEY, JSON.stringify(selected));
    window.localStorage.setItem(ORDER_QUANTITIES_KEY, JSON.stringify(quantities));
    window.localStorage.setItem(ORDER_BUSINESS_KEY, businessName);
    window.localStorage.setItem(ORDER_NOTES_KEY, notes);
    notifyOrderUpdated();
  }, [businessName, loaded, notes, quantities, selected]);

  const selectedProducts = useMemo(
    () => wholesaleProducts.filter((product) => selected.includes(product.id)),
    [selected],
  );

  const orderText = useMemo(() => {
    const lines = [
      "Hola Hamdan, quisiera hacer una consulta mayorista.",
      businessName.trim() ? `Comercio / nombre: ${businessName.trim()}` : "",
      selectedProducts.length ? "Productos:" : "",
      ...selectedProducts.map((product) => {
        const quantity = quantities[product.id]?.trim();
        return `- ${product.name}${quantity ? ` — ${quantity}` : ""}`;
      }),
      notes.trim() ? `Detalle adicional: ${notes.trim()}` : "",
      "¿Me pueden indicar disponibilidad y precio vigente?",
    ].filter(Boolean);

    return lines.join("\n");
  }, [businessName, notes, quantities, selectedProducts]);

  const whatsappUrl = `https://wa.me/543813514449?text=${encodeURIComponent(orderText)}`;

  function updateQuantity(productId: string, value: string) {
    setQuantities((current) => ({ ...current, [productId]: value.slice(0, 80) }));
  }

  function removeProduct(productId: string) {
    setSelected((current) => current.filter((id) => id !== productId));
    setQuantities((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }

  function clearOrder() {
    setSelected([]);
    setQuantities({});
    setBusinessName("");
    setNotes("");
  }

  async function copyOrder() {
    if (!selectedProducts.length) return;

    try {
      await navigator.clipboard.writeText(orderText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (!loaded) {
    return (
      <div className="rounded-[2rem] border border-[#8f1f23]/10 bg-white/70 p-8 text-center text-sm text-[#756158]">
        Cargando tu pedido…
      </div>
    );
  }

  if (!selectedProducts.length) {
    return (
      <div className="rounded-[2rem] border border-[#8f1f23]/10 bg-white/75 p-8 text-center shadow-[0_16px_36px_rgba(84,48,30,0.07)] sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0b7] text-[#20180f] shadow-inner">
          <BasketIcon size={31} />
        </span>
        <h2 className="font-display mt-5 text-3xl font-black text-[#771e23]">Tu pedido está vacío</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#705d53]">Elegí los productos que querés consultar. El pedido queda guardado en este dispositivo mientras navegás.</p>
        <Link href="/mayorista#catalogo" className="mt-6 inline-flex items-center justify-center rounded-xl border border-[#d2ad59]/70 bg-[#fff5d8] px-5 py-3 text-sm font-black text-[#21180f] transition hover:-translate-y-0.5 hover:bg-[#ffe9a8]">
          Ver catálogo mayorista →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="rounded-[2rem] border border-[#8f1f23]/10 bg-white/80 p-5 shadow-[0_16px_36px_rgba(84,48,30,0.07)] sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#8f1f23]/10 pb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a66c1e]">Productos seleccionados</p>
            <h2 className="font-display mt-2 text-3xl font-black text-[#771e23]">{selectedProducts.length} {selectedProducts.length === 1 ? "producto" : "productos"}</h2>
          </div>
          <Link href="/mayorista#catalogo" className="rounded-xl border border-[#8f1f23]/15 bg-[#fffaf2] px-4 py-2.5 text-xs font-black text-[#7a2022] transition hover:bg-white">
            + Seguir agregando
          </Link>
        </div>

        <div className="mt-5 grid gap-4">
          {selectedProducts.map((product) => (
            <article key={product.id} className="grid gap-4 rounded-2xl border border-[#8f1f23]/10 bg-[#fffaf2] p-4 sm:grid-cols-[1fr_220px_auto] sm:items-center">
              <div>
                <h3 className="font-display text-xl font-black text-[#742026]">{product.name}</h3>
                <p className="mt-1 text-xs leading-5 text-[#756158]">{product.description}</p>
              </div>
              <label className="text-[11px] font-black uppercase tracking-[0.1em] text-[#795146]">
                Cantidad / presentación
                <input
                  value={quantities[product.id] ?? ""}
                  onChange={(event) => updateQuantity(product.id, event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#8f1f23]/15 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#4f3b33] outline-none transition focus:border-[#8f1f23]/45"
                  placeholder="Ej. 2 hormas"
                />
              </label>
              <button type="button" onClick={() => removeProduct(product.id)} className="rounded-xl border border-[#8f1f23]/12 px-3 py-2 text-xs font-black text-[#8f1f23] transition hover:bg-[#8f1f23] hover:text-white">
                Quitar
              </button>
            </article>
          ))}
        </div>

        <button type="button" onClick={clearOrder} className="mt-5 text-xs font-black text-[#8f1f23] underline decoration-[#8f1f23]/30 underline-offset-4 transition hover:decoration-[#8f1f23]">
          Vaciar pedido
        </button>
      </section>

      <aside className="h-fit rounded-[2rem] border border-[#8f1f23]/12 bg-[#f7ead7] p-6 shadow-[0_16px_34px_rgba(84,48,30,0.08)] xl:sticky xl:top-32">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a66c1e]">Datos de la consulta</p>
        <h2 className="font-display mt-2 text-3xl font-black leading-none text-[#771e23]">Listo para enviar</h2>
        <p className="mt-3 text-sm leading-6 text-[#715e53]">Completá lo necesario y enviá el resumen por WhatsApp. Hamdan confirma precio y disponibilidad.</p>

        <label className="mt-5 block text-xs font-black uppercase tracking-[0.1em] text-[#70453b]">
          Nombre o comercio
          <input
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value.slice(0, 100))}
            className="mt-2 w-full rounded-xl border border-[#8f1f23]/15 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#4f3b33] outline-none transition focus:border-[#8f1f23]/45"
            placeholder="Ej. Almacén San Martín"
          />
        </label>

        <label className="mt-4 block text-xs font-black uppercase tracking-[0.1em] text-[#70453b]">
          Observaciones
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value.slice(0, 800))}
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-[#8f1f23]/15 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#4f3b33] outline-none transition focus:border-[#8f1f23]/45"
            placeholder="Marca preferida, formato u otra consulta..."
          />
        </label>

        <div className="mt-5 rounded-2xl border border-[#8f1f23]/10 bg-white/65 p-4 text-xs leading-5 text-[#66534a]">
          <p className="font-black text-[#7c2526]">Vista previa</p>
          <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-sans text-[11px] leading-5 text-[#66534a]">{orderText}</pre>
        </div>

        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#15975d]/45 bg-[#15975d]/12 px-5 py-3.5 text-sm font-black text-[#0b7145] transition hover:-translate-y-0.5 hover:bg-[#15975d]/18 hover:shadow-md">
          <WhatsAppIcon size={19} /> Enviar pedido por WhatsApp
        </a>

        <button type="button" onClick={copyOrder} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#8f1f23]/15 bg-white/75 px-5 py-3 text-sm font-black text-[#7b2022] transition hover:bg-white">
          <ClipboardIcon size={18} /> {copied ? "Pedido copiado ✓" : "Copiar resumen"}
        </button>
      </aside>
    </div>
  );
}
