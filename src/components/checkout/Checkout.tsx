"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { StoreMode } from "@/data/catalog";
import { whatsappUrl } from "@/data/business";
import {
  buildWhatsAppMessage,
  validateCheckout,
  type CheckoutData,
  type CheckoutErrors,
} from "@/lib/checkout";
import { buildOrderLines } from "@/lib/order";
import { getCartSnapshot } from "@/lib/storeCart";
import { useStoreCart } from "@/lib/useStoreCart";
import { useCheckoutDraft } from "@/lib/useCheckoutDraft";
import { WhatsAppIcon } from "@/components/Icons";
import CartSummary from "./CartSummary";
import CustomerFields from "./CustomerFields";
import DeliveryFields from "./DeliveryFields";

export default function Checkout({ mode }: { mode: StoreMode }) {
  const cart = useStoreCart(mode);
  const { data, update, ready } = useCheckoutDraft(mode);
  const [touched, setTouched] = useState<
    Partial<Record<keyof CheckoutData, boolean>>
  >({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const lines = buildOrderLines(mode, cart.selected, cart.quantities);
  const validation = validateCheckout(data, lines, mode);
  const canSend = ready && cart.loaded && validation.valid;
  const visibleErrors: CheckoutErrors = Object.fromEntries(
    Object.entries(validation.fields).filter(
      ([field]) => showAllErrors || touched[field as keyof CheckoutData],
    ),
  );

  function focusFirstError() {
    setShowAllErrors(true);
    const field = Object.keys(validation.fields)[0];
    const target = field
      ? document.getElementById(`checkout-${field}`)
      : document.querySelector<HTMLInputElement>(
          '#carrito input[aria-invalid="true"]',
        );
    target?.focus();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const current = getCartSnapshot(mode);
    const currentLines = buildOrderLines(
      mode,
      current.selected,
      current.quantities,
    );
    if (
      !ready ||
      !current.loaded ||
      !validateCheckout(data, currentLines, mode).valid
    ) {
      focusFirstError();
      return;
    }
    const url = whatsappUrl(buildWhatsAppMessage(data, currentLines, mode));
    window.open(url, "_blank", "noopener,noreferrer");
    setHandoff(true);
  }

  const fieldProps = {
    data,
    errors: visibleErrors,
    onChange: update,
    onBlur: (field: keyof CheckoutData) =>
      setTouched((current) => ({ ...current, [field]: true })),
  };

  return (
    <div className="checkout-layout mx-auto max-w-[1300px] px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link
        href={`/${mode}#catalogo`}
        className="checkout-focus inline-block rounded text-sm font-bold text-[#8f1f23]"
      >
        ← Seguir comprando en {mode}
      </Link>
      <div className="mb-8 mt-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a5752b]">
          Pedido {mode} · Último paso
        </p>
        <h1 className="font-display mt-3 text-4xl font-black text-[#7c171c] sm:text-5xl">
          Revisá y prepará tu pedido
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#715e53] sm:text-base">
          Completá tus datos y elegí cómo recibirlo. Te llevamos a WhatsApp con
          el resumen listo para enviar.
        </p>
      </div>
      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(340px,440px)]">
        <form
          id="checkout-form"
          onSubmit={submit}
          noValidate
          className="min-w-0 space-y-6"
          aria-busy={!ready}
        >
          <fieldset
            disabled={!ready}
            className="min-w-0 space-y-6 disabled:opacity-60"
          >
            <legend className="sr-only">Datos del pedido {mode}</legend>
            <CustomerFields {...fieldProps} />
            <DeliveryFields {...fieldProps} />
            <section className="checkout-section">
              <label
                htmlFor="checkout-notes"
                className="font-display block text-2xl font-black text-[#742026]"
              >
                Observaciones{" "}
                <span className="font-sans text-sm font-normal text-[#796052]">
                  (opcional)
                </span>
              </label>
              <textarea
                id="checkout-notes"
                name="notes"
                rows={3}
                maxLength={800}
                value={data.notes}
                onChange={(event) => update("notes", event.target.value)}
                className="checkout-input mt-4 w-full resize-y px-4 py-3 text-base"
                placeholder="¿Hay algún detalle que debamos tener en cuenta?"
              />
              <p className="mt-2 text-xs leading-5 text-[#81695a]">
                El detalle de productos se completa automáticamente desde tu
                carrito.
              </p>
            </section>
          </fieldset>
        </form>
        <CartSummary mode={mode}>
          {!canSend && ready && Object.keys(validation.fields).length > 0 && (
            <div
              id="checkout-form-hint"
              className="mt-4 text-xs leading-5 text-[#795f51]"
            >
              <p>Completá los datos obligatorios para habilitar el envío.</p>
              <button
                type="button"
                onClick={focusFirstError}
                className="checkout-focus mt-1 rounded py-1 font-bold text-[#8f1f23] underline underline-offset-4"
              >
                Ver campos pendientes
              </button>
            </div>
          )}
          <button
            type="submit"
            form="checkout-form"
            disabled={!canSend}
            className="checkout-whatsapp checkout-focus soft-press mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-black"
            aria-describedby={!canSend ? "checkout-send-help" : undefined}
          >
            <WhatsAppIcon size={20} className="shrink-0" />
            Enviar pedido por WhatsApp
          </button>
          <p
            id="checkout-send-help"
            className="mt-3 text-center text-xs leading-5 text-[#795f51]"
          >
            {canSend
              ? "Se abrirá WhatsApp. Revisá el mensaje y tocá Enviar."
              : "El botón se habilita con datos válidos y el pedido completo."}
          </p>
          {handoff && (
            <div
              role="status"
              className="mt-4 rounded-xl border border-[#15975d]/25 bg-[#eef9f3] p-4 text-sm leading-6 text-[#256147]"
            >
              <p>
                Tu pedido queda pendiente de que envíes el mensaje y Hamdan lo
                confirme.
              </p>
              {canSend && (
                <a
                  href={whatsappUrl(buildWhatsAppMessage(data, lines, mode))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="checkout-focus mt-2 inline-block rounded font-bold underline underline-offset-4"
                >
                  Abrir WhatsApp con el pedido actual
                </a>
              )}
            </div>
          )}
        </CartSummary>
      </div>
    </div>
  );
}
