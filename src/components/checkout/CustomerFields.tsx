import CheckoutField from "./CheckoutField";
import {
  orderTypes,
  type CheckoutData,
  type CheckoutErrors,
} from "@/lib/checkout";

export type CheckoutFieldProps = {
  data: CheckoutData;
  errors: CheckoutErrors;
  onChange: <K extends keyof CheckoutData>(
    field: K,
    value: CheckoutData[K],
  ) => void;
  onBlur: (field: keyof CheckoutData) => void;
};

export default function CustomerFields({
  data,
  errors,
  onChange,
  onBlur,
}: CheckoutFieldProps) {
  const selectedType = orderTypes.find((item) => item.value === data.orderType);
  const field = (name: keyof CheckoutData) => ({
    name,
    value: data[name],
    error: errors[name],
    onChange: (value: string) => onChange(name, value),
    onBlur: () => onBlur(name),
  });
  return (
    <section className="checkout-section" aria-labelledby="customer-title">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#a5752b]">
        01 · Tus datos
      </p>
      <h2
        id="customer-title"
        className="font-display mt-2 text-3xl font-black text-[#742026]"
      >
        ¿A nombre de quién?
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#796052]">
        Los campos con * son obligatorios. No necesitás una cuenta.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <CheckoutField
          {...field("fullName")}
          label="Nombre y apellido"
          required
          autoComplete="name"
        />
        <CheckoutField
          {...field("phone")}
          label="Número de teléfono"
          required
          type="tel"
          autoComplete="tel"
          maxLength={30}
          hint="Incluí el código de área. Ej.: 381 123 4567."
        />
        <div className="sm:col-span-2">
          <label
            htmlFor="checkout-orderType"
            className="block text-sm font-bold text-[#663c31]"
          >
            Tipo de pedido <span aria-hidden="true">*</span>
          </label>
          <select
            id="checkout-orderType"
            name="orderType"
            value={data.orderType}
            onChange={(event) => {
              const type = orderTypes.find(
                (item) => item.value === event.target.value,
              );
              onChange("orderType", type?.value ?? "");
              onChange("businessName", "");
            }}
            onBlur={() => onBlur("orderType")}
            required
            aria-invalid={Boolean(errors.orderType)}
            aria-describedby={
              errors.orderType ? "checkout-orderType-error" : undefined
            }
            className="checkout-input mt-2 w-full px-4 py-3 text-base"
          >
            <option value="">Seleccioná una opción</option>
            {orderTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.orderType && (
            <p
              id="checkout-orderType-error"
              className="mt-2 text-sm text-[#a22c31]"
            >
              {errors.orderType}
            </p>
          )}
        </div>
        {selectedType?.detailLabel && (
          <div className="checkout-fields-enter sm:col-span-2">
            <CheckoutField
              {...field("businessName")}
              label={selectedType.detailLabel}
              required
              autoComplete={
                data.orderType === "evento" ? "off" : "organization"
              }
            />
          </div>
        )}
        <CheckoutField
          {...field("taxId")}
          label="DNI o CUIT/CUIL (opcional)"
          maxLength={30}
        />
        <CheckoutField
          {...field("email")}
          label="Correo electrónico (opcional)"
          type="email"
          autoComplete="email"
          maxLength={254}
        />
      </div>
    </section>
  );
}
