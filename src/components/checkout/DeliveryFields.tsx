import { business } from "@/data/business";
import CheckoutField from "./CheckoutField";
import type { CheckoutFieldProps } from "./CustomerFields";
import { PinIcon, StoreIcon } from "@/components/Icons";

export default function DeliveryFields({ data, errors, onChange, onBlur }: CheckoutFieldProps) {
  return (
    <section className="checkout-section" aria-labelledby="delivery-title">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#a5752b]">02 · Entrega</p>
      <h2 id="delivery-title" className="font-display mt-2 text-3xl font-black text-[#742026]">¿Cómo lo recibís?</h2>
      <fieldset className="mt-6">
        <legend className="sr-only">Modalidad de entrega</legend>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: "envio", label: "Envío", Icon: PinIcon },
            { value: "retiro", label: "Retiro del local", Icon: StoreIcon },
          ] as const).map(({ value, label, Icon }) => (
            <label key={value} className="cursor-pointer">
              <input type="radio" name="delivery" value={value} checked={data.delivery === value} onChange={() => onChange("delivery", value)} className="peer sr-only" />
              <span className="delivery-option flex h-full items-center gap-3 rounded-2xl border border-[#cda66a]/50 bg-[#fffdf7] p-4 text-sm font-bold text-[#6a4537] transition peer-checked:border-[#8f1f23] peer-checked:bg-[#fff0c4] peer-checked:text-[#7c171c] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#8f1f23]">
                <Icon size={22} className="shrink-0" />{label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {errors.delivery && <p className="mt-2 text-sm text-[#a22c31]">{errors.delivery}</p>}
      <div key={data.delivery} className="checkout-fields-enter mt-5">
        {data.delivery === "envio" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><CheckoutField name="address" label="Dirección" value={data.address} onChange={(value) => onChange("address", value)} onBlur={() => onBlur("address")} error={errors.address} required autoComplete="street-address" maxLength={200} /></div>
            <CheckoutField name="locality" label="Localidad / zona" value={data.locality} onChange={(value) => onChange("locality", value)} onBlur={() => onBlur("locality")} autoComplete="address-level2" />
            <CheckoutField name="reference" label="Referencia (opcional)" value={data.reference} onChange={(value) => onChange("reference", value)} onBlur={() => onBlur("reference")} maxLength={200} />
            <p className="text-xs leading-5 text-[#81695a] sm:col-span-2">Coordinamos la disponibilidad y el costo del envío al confirmar tu pedido.</p>
          </div>
        ) : (
          <address className="rounded-2xl border border-[#d8b778]/40 bg-[#fff7df] p-5 text-sm not-italic leading-7 text-[#684e3e]">
            <strong className="block text-[#742026]">Retiro en {business.name}</strong>
            {business.address}<br />{business.city}
          </address>
        )}
      </div>
    </section>
  );
}
