"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { saveProductImage } from "@/app/admin/image-actions";
import type { AdminProduct } from "@/lib/admin-product";
import { prepareProductImage } from "@/lib/prepare-product-image";
import {
  PRODUCT_IMAGE_BUCKET,
  productImagePath,
  type ProductImageResult,
} from "@/lib/product-image";
import { createClient } from "@/lib/supabase/client";

export default function ProductImageEditor({
  product,
  updatedAt,
  disabled,
  onBusy,
  onSaved,
}: {
  product: AdminProduct;
  updatedAt: string;
  disabled: boolean;
  onBusy: (busy: boolean) => void;
  onSaved: (updatedAt: string) => void;
}) {
  const [current, setCurrent] = useState(product.image_url);
  const [alt, setAlt] = useState(product.image_alt ?? product.name);
  const [candidate, setCandidate] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [stagedPath, setStagedPath] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ProductImageResult>({
    ok: false,
    message: "",
  });
  const input = useRef<HTMLInputElement>(null);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  const locked = disabled || busy;
  function loading(value: boolean) {
    setBusy(value);
    onBusy(value);
  }

  async function discardStaged() {
    if (stagedPath) {
      // A lost save response might already have committed: RLS protects referenced files.
      const { error } = await createClient()
        .storage.from(PRODUCT_IMAGE_BUCKET)
        .remove([stagedPath]);
      if (error)
        throw new Error(
          "No pudimos limpiar la imagen pendiente. Intentá nuevamente.",
        );
      setStagedPath(null);
    }
  }

  async function select(file: File | undefined) {
    if (!file || locked) return;
    loading(true);
    setResult({ ok: false, message: "Preparando imagen…" });
    try {
      const prepared = await prepareProductImage(file);
      await discardStaged();
      setCandidate(prepared);
      setPreview(URL.createObjectURL(prepared));
      setRemove(false);
      setResult({
        ok: true,
        message:
          "Vista previa lista. Guardá la imagen para publicarla en la tienda.",
      });
    } catch (error) {
      setResult({
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "No pudimos preparar la imagen.",
      });
    } finally {
      loading(false);
      if (input.current) input.current.value = "";
    }
  }

  async function markRemoval() {
    loading(true);
    try {
      await discardStaged();
      setCandidate(null);
      setPreview(null);
      setRemove(true);
      setResult({
        ok: true,
        message: "Guardá para quitar la imagen del producto.",
      });
    } catch (error) {
      setResult({
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "No pudimos preparar el cambio.",
      });
    } finally {
      loading(false);
    }
  }

  async function save() {
    if (locked) return;
    loading(true);
    setResult({
      ok: false,
      message: candidate ? "Subiendo y guardando imagen…" : "Guardando imagen…",
    });
    try {
      let path = stagedPath;
      if (candidate && !path) {
        path = productImagePath(
          product.id,
          crypto.randomUUID(),
          candidate.type,
        );
        const uploaded = await createClient()
          .storage.from(PRODUCT_IMAGE_BUCKET)
          .upload(path, candidate, {
            contentType: candidate.type,
            cacheControl: "31536000",
            upsert: false,
          });
        if (uploaded.error)
          throw new Error(
            "No pudimos subir la imagen. Revisá tu sesión y volvé a intentar.",
          );
        setStagedPath(path);
      }
      const form = new FormData();
      form.set("id", product.id);
      form.set("updatedAt", updatedAt);
      form.set("intent", remove ? "remove" : candidate ? "replace" : "alt");
      form.set("imageAlt", alt);
      if (path) form.set("path", path);
      const saved = await saveProductImage(form);
      setResult(saved);
      if (saved.ok && saved.updatedAt) {
        setCurrent(saved.imageUrl ?? null);
        setAlt(saved.imageAlt ?? product.name);
        setCandidate(null);
        setPreview(null);
        setStagedPath(null);
        setRemove(false);
        onSaved(saved.updatedAt);
      }
    } catch (error) {
      // Do not delete on an uncertain network response: the product might already reference it.
      setResult({
        ok: false,
        message:
          error instanceof Error && error.message.startsWith("No pudimos subir")
            ? error.message
            : "No pudimos completar el guardado. Reintentá o actualizá el panel para comprobar el estado de la imagen.",
      });
    } finally {
      loading(false);
    }
  }

  const visibleImage = remove ? null : (preview ?? current);
  return (
    <fieldset
      disabled={locked}
      className="mt-6 space-y-3 border-t border-[#8f1f23]/15 pt-5 disabled:opacity-60"
      aria-busy={busy}
    >
      <legend className="sr-only">Imagen de {product.name}</legend>
      <p className="text-sm font-bold text-[#663c31]">Imagen del producto</p>
      <div className="relative flex aspect-[16/7] items-center justify-center overflow-hidden rounded-2xl border border-[#7f241f]/10 bg-[#fff7e7]">
        {visibleImage ? (
          <Image
            src={visibleImage}
            alt={alt.trim() || product.name}
            fill
            sizes="(max-width: 1023px) 90vw, 45vw"
            unoptimized={Boolean(preview)}
            className="object-contain object-center p-3"
          />
        ) : (
          <p className="px-4 text-center text-sm text-[#796052]">
            Sin imagen. La tienda muestra la imagen de categoría.
          </p>
        )}
      </div>
      <p className="text-xs leading-5 text-[#796052]">
        WebP, JPEG o PNG, hasta 5 MB. Referencia: 1600 × 700 px. Se conservan
        las proporciones; no necesitás redimensionar el archivo.
      </p>
      <input
        ref={input}
        type="file"
        accept="image/webp,image/jpeg,image/png"
        aria-label={`Seleccionar imagen de ${product.name}`}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          void select(event.target.files?.[0]);
        }}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="checkout-focus rounded-xl border border-[#8f1f23]/20 px-4 py-2 text-sm font-bold text-[#8f1f23]"
        >
          Cambiar imagen
        </button>
        {(current || candidate) && !remove && (
          <button
            type="button"
            onClick={() => {
              void markRemoval();
            }}
            className="checkout-focus rounded-xl border border-[#8f1f23]/20 px-4 py-2 text-sm font-bold text-[#8f1f23]"
          >
            Quitar imagen
          </button>
        )}
        {remove && (
          <button
            type="button"
            onClick={() => {
              setRemove(false);
              setResult({ ok: false, message: "" });
            }}
            className="checkout-focus rounded-xl px-4 py-2 text-sm font-bold text-[#8f1f23]"
          >
            Conservar imagen
          </button>
        )}
      </div>
      <label className="block text-sm font-bold text-[#663c31]">
        Descripción de la imagen
        <input
          type="text"
          value={alt}
          onChange={(event) => setAlt(event.target.value)}
          maxLength={300}
          disabled={locked || remove || (!current && !candidate)}
          className="checkout-input mt-2 w-full px-3 py-3"
          placeholder={product.name}
        />
      </label>
      <button
        type="button"
        onClick={() => {
          void save();
        }}
        disabled={locked || (!current && !candidate && !remove)}
        className="cheese-action checkout-focus w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60"
      >
        {busy ? "Procesando…" : "Guardar imagen"}
      </button>
      {result.message && (
        <p
          role={busy || result.ok ? "status" : "alert"}
          className={`text-sm leading-6 ${result.ok ? "text-[#27734c]" : "text-[#9a302e]"}`}
        >
          {result.message}
        </p>
      )}
    </fieldset>
  );
}
