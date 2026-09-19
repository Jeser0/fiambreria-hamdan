import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from "react";
import type { CheckoutData } from "@/lib/checkout";

type Props = {
  name: keyof CheckoutData;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  maxLength?: number;
  hint?: string;
};

export default function CheckoutField({ name, label, error, hint, required, ...input }: Props) {
  const id = `checkout-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-[#663c31]">{label}{required && <span aria-hidden="true" className="text-[#8f1f23]"> *</span>}</label>
      <input {...input} name={name} id={id} required={required} maxLength={input.maxLength ?? 120} onChange={(event) => input.onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={[error ? `${id}-error` : "", hint ? `${id}-hint` : ""].filter(Boolean).join(" ") || undefined} className="checkout-input mt-2 w-full px-4 py-3 text-base" />
      {hint && <p id={`${id}-hint`} className="mt-2 text-xs leading-5 text-[#81695a]">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-2 text-sm text-[#a22c31]">{error}</p>}
    </div>
  );
}
