"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState(login, { message: "" });
  return (
    <form action={action} className="mt-6 space-y-5" aria-busy={pending}>
      <label className="block text-sm font-bold text-[#663c31]">
        Correo electrónico
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          maxLength={254}
          className="checkout-input mt-2 w-full px-4 py-3"
          disabled={pending}
        />
      </label>
      <label className="block text-sm font-bold text-[#663c31]">
        Contraseña
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          maxLength={1024}
          className="checkout-input mt-2 w-full px-4 py-3"
          disabled={pending}
        />
      </label>
      {state.message && (
        <p role="alert" className="text-sm leading-6 text-[#9a302e]">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="cheese-action checkout-focus w-full rounded-xl px-5 py-3 font-black disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
