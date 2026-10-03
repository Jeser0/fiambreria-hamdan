"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-auth";
import {
  parseProductImageEdit,
  productImagePath,
  PRODUCT_IMAGE_BUCKET,
  validateProductImageContents,
  type ProductImageResult,
} from "@/lib/product-image";
import { persistProductImage } from "@/lib/persist-product-image";

export async function saveProductImage(
  form: FormData,
): Promise<ProductImageResult> {
  try {
    const session = await getAdminSession();
    if (!session)
      return {
        ok: false,
        message: "Tu sesión no tiene permiso. Volvé a iniciar sesión.",
      };
    const edit = parseProductImageEdit(form);
    const { supabase } = session;
    const current = await supabase
      .from("products")
      .select("name, image_url, image_alt, updated_at")
      .eq("id", edit.id)
      .maybeSingle();
    if (current.error)
      throw new Error("No pudimos consultar el producto. Intentá nuevamente.");
    if (!current.data || current.data.updated_at !== edit.updatedAt)
      return {
        ok: false,
        message:
          "El producto cambió. Actualizá el panel antes de guardar la imagen.",
      };
    let imageUrl = current.data.image_url;
    if (edit.intent === "replace" && edit.path) {
      // Validate the stored bytes, not the browser's MIME declaration or original filename.
      const uploaded = await supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .download(edit.path);
      if (uploaded.error || !uploaded.data)
        throw new Error(
          "No pudimos verificar la imagen subida. Intentá nuevamente.",
        );
      await validateProductImageContents(uploaded.data);
      if (
        productImagePath(
          edit.id,
          edit.path.split("/")[1].split(".")[0],
          uploaded.data.type,
        ) !== edit.path
      )
        throw new Error("El formato de la imagen no coincide con su ruta.");
      imageUrl = supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .getPublicUrl(edit.path).data.publicUrl;
    } else if (edit.intent === "remove") imageUrl = null;
    const imageAlt = imageUrl ? edit.alt || current.data.name : null;
    const saved = await persistProductImage({
      id: edit.id,
      baseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      oldUrl: current.data.image_url,
      newUrl: imageUrl,
      save: async () => {
        const result = await supabase
          .from("products")
          .update({ image_url: imageUrl, image_alt: imageAlt })
          .eq("id", edit.id)
          .eq("updated_at", edit.updatedAt)
          .select("updated_at")
          .maybeSingle();
        if (result.error)
          throw new Error(
            "No pudimos confirmar el guardado. Actualizá el panel para comprobar el estado de la imagen.",
          );
        return result.data?.updated_at ?? null;
      },
      remove: async (path) => {
        // Storage RLS also refuses deletion while any product still references this file.
        const result = await supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .remove([path]);
        return !result.error && Boolean(result.data?.length);
      },
    });
    if (!saved.updatedAt)
      return {
        ok: false,
        message:
          "El producto cambió. Actualizá el panel antes de guardar la imagen.",
      };
    revalidatePath("/mayorista");
    revalidatePath("/minorista");
    revalidatePath("/pedido", "layout");
    return {
      ok: true,
      message: saved.cleanupFailed
        ? "Imagen guardada. El archivo anterior quedó pendiente de limpieza; la tienda ya muestra el cambio."
        : edit.intent === "remove"
          ? "Imagen quitada. La tienda vuelve a mostrar la imagen de categoría."
          : "Imagen guardada. La tienda ya puede mostrarla.",
      updatedAt: saved.updatedAt,
      imageUrl,
      imageAlt,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "No pudimos guardar la imagen. Intentá nuevamente.",
    };
  }
}
