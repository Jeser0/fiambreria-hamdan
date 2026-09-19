"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { StoreMode } from "@/data/catalog";
import {
  buildOrderLines,
  calculateOrderTotal,
  formatARS,
  getWholesaleMinimums,
  isPackagedProduct,
  productLabel,
} from "@/lib/order";
import { useStoreCart } from "@/lib/useStoreCart";

export default function CartSummary({
  mode,
  children,
}: {
  mode: StoreMode;
  children?: ReactNode;
}) {
  const cart = useStoreCart(mode);
  const lines = buildOrderLines(mode, cart.selected, cart.quantities);
  const minimums = getWholesaleMinimums(mode, lines);
  const total = calculateOrderTotal(lines);

  return (
    <aside
      id="carrito"
      aria-labelledby="cart-title"
      aria-busy={!cart.loaded}
      className="order-summary h-fit min-w-0 scroll-mt-40 rounded-[2rem] border border-[#d6ae55]/40 bg-[#fff0b7]/70 p-5 shadow-[0_16px_34px_rgba(84,48,30,0.08)] sm:p-6 lg:sticky lg:top-36"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8b601e]">
            Pedido {mode}
          </p>
          <h2
            id="cart-title"
            className="font-display mt-2 text-3xl font-black text-[#5f271f]"
          >
            Tu pedido
          </h2>
        </div>
        {lines.length > 0 && (
          <button
            type="button"
            onClick={cart.clearCart}
            className="checkout-focus rounded-lg px-2 py-2 text-xs font-bold text-[#8f1f23] underline underline-offset-4"
          >
            Vaciar
          </button>
        )}
      </div>
      <p className="mt-2 text-sm leading-6 text-[#715e53]">
        Revisá las cantidades antes de confirmar.
      </p>
      {!cart.loaded ? (
        <p className="py-8 text-sm" role="status">
          Cargando tu carrito…
        </p>
      ) : lines.length === 0 ? (
        <div className="my-5 rounded-2xl border border-dashed border-[#b98525]/35 bg-white/60 p-5 text-sm leading-6">
          <p>Tu carrito está vacío.</p>
          <Link
            href={`/${mode}#catalogo`}
            className="checkout-focus mt-2 inline-block rounded font-bold text-[#8f1f23] underline underline-offset-4"
          >
            Elegir productos →
          </Link>
        </div>
      ) : (
        <ul
          aria-label="Productos de tu pedido"
          className="mt-5 max-h-[min(26rem,50vh)] space-y-3 overflow-y-auto overscroll-contain pr-1"
        >
          {lines.map((line) => {
            const { product, quantityError } = line;
            const label = productLabel(product);
            const id = `quantity-${product.id}`;
            return (
              <li
                key={product.id}
                className="rounded-2xl border border-[#8f1f23]/10 bg-white/80 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold leading-5 text-[#5f3028]">
                    {label}
                  </p>
                  <button
                    type="button"
                    onClick={() => cart.removeProduct(product.id)}
                    aria-label={`Quitar ${label}`}
                    className="checkout-focus -mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl text-[#8f1f23] hover:bg-[#fff0e4]"
                  >
                    ×
                  </button>
                </div>
                <p className="mt-1 text-xs text-[#725749]">
                  Precio unitario: {formatARS(line.unitPrice)}
                </p>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                  <div className="w-28">
                    <label
                      htmlFor={id}
                      className="text-xs font-bold text-[#6a4c3e]"
                    >
                      Cantidad
                    </label>
                    <input
                      id={id}
                      type="text"
                      inputMode={
                        isPackagedProduct(product) ? "numeric" : "decimal"
                      }
                      value={cart.quantities[product.id] ?? ""}
                      onChange={(event) =>
                        cart.setQuantity(product.id, event.target.value)
                      }
                      aria-label={`Cantidad para ${label}`}
                      aria-invalid={Boolean(quantityError)}
                      aria-describedby={
                        quantityError ? `${id}-error` : undefined
                      }
                      maxLength={12}
                      className="checkout-input mt-1 w-full px-3 py-2 text-base tabular-nums"
                    />
                  </div>
                  <p className="text-right text-xs text-[#725749]">
                    Subtotal
                    <br />
                    <span className="mt-1 block text-base font-black tabular-nums text-[#642a24]">
                      {formatARS(line.subtotal)}
                    </span>
                  </p>
                </div>
                {quantityError && (
                  <p
                    id={`${id}-error`}
                    className="mt-2 text-xs leading-5 text-[#a22c31]"
                  >
                    {quantityError}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {minimums.length > 0 && (
        <div
          className="mt-4 rounded-2xl border border-[#b98525]/20 bg-[#fff9e3] p-4"
          aria-live="polite"
          aria-atomic="true"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.1em] text-[#79551d]">
            Mínimos mayoristas
          </h3>
          <ul className="mt-2 space-y-2 text-xs leading-5">
            {minimums.map((item) => (
              <li
                key={item.category}
                className={item.missing ? "text-[#9a302e]" : "text-[#27734c]"}
              >
                <span className="font-bold">
                  {item.label}: {item.quantity}/{item.minimum} {item.unit}
                </span>
                <span className="block">
                  {item.missing
                    ? item.missing === 1
                      ? `Falta 1 ${item.category === "pizzas" ? "unidad" : "paquete"}.`
                      : `Faltan ${item.missing} ${item.unit} surtidos.`
                    : "✓ Mínimo cumplido"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-5 border-t border-[#b98525]/25 pt-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#725024]">
          Total estimado
        </p>
        <p
          className="font-display mt-1 min-h-10 text-3xl font-black tabular-nums text-[#742026]"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">Total estimado: </span>
          <span
            key={total}
            className="order-total-update inline-block"
            data-testid="order-total"
          >
            {formatARS(total)}
          </span>
        </p>
        <p className="mt-2 text-xs leading-5 text-[#796052]">
          Confirmamos disponibilidad, total final y, si corresponde, costo de
          envío por WhatsApp.
        </p>
      </div>
      {!cart.persistent && (
        <p role="status" className="mt-3 text-xs text-[#9a302e]">
          Tu navegador no permite guardar el carrito. Se conservará mientras
          sigas en esta página.
        </p>
      )}
      {children ??
        (lines.length > 0 && cart.loaded ? (
          <Link
            href={`/pedido/${mode}`}
            className="cheese-action checkout-focus soft-press mt-5 flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-black"
          >
            Revisar y finalizar pedido →
          </Link>
        ) : (
          <button
            disabled
            className="cheese-action mt-5 w-full rounded-xl px-5 py-3.5 text-sm font-black opacity-50"
          >
            Agregá productos para continuar
          </button>
        ))}
    </aside>
  );
}
