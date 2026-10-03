export const PRODUCT_IMAGE_BUCKET = "product-images";
export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_TYPES = [
  "image/webp",
  "image/jpeg",
  "image/png",
] as const;

export function validateProductImage(file: { size: number; type: string }) {
  if (
    !PRODUCT_IMAGE_TYPES.includes(
      file.type as (typeof PRODUCT_IMAGE_TYPES)[number],
    )
  )
    throw new Error("Elegí una imagen WebP, JPEG o PNG.");
  if (!file.size || file.size > MAX_PRODUCT_IMAGE_BYTES)
    throw new Error("La imagen debe pesar entre 1 byte y 5 MB.");
}

export async function validateProductImageContents(file: Blob) {
  validateProductImage(file);
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const text = (start: number, end: number) =>
    String.fromCharCode(...bytes.slice(start, end));
  const valid =
    file.type === "image/png"
      ? [137, 80, 78, 71, 13, 10, 26, 10].every(
          (byte, index) => bytes[index] === byte,
        )
      : file.type === "image/jpeg"
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : text(0, 4) === "RIFF" &&
          text(8, 12) === "WEBP" &&
          ["VP8 ", "VP8L", "VP8X"].includes(text(12, 16));
  if (!valid)
    throw new Error(
      "El contenido del archivo no coincide con un formato de imagen permitido.",
    );
}

export function productImagePath(id: string, uuid: string, type: string) {
  const extension = {
    "image/webp": "webp",
    "image/jpeg": "jpg",
    "image/png": "png",
  }[type];
  if (
    !/^[a-z0-9][a-z0-9-]{0,159}$/.test(id) ||
    !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(uuid) ||
    !extension
  )
    throw new Error("La ruta de imagen es inválida.");
  return `${id}/${uuid}.${extension}`;
}

export function isProductImagePath(path: unknown, id: string): path is string {
  if (typeof path !== "string") return false;
  const [folder, file, extra] = path.split("/");
  if (folder !== id || extra !== undefined || !file) return false;
  const match = file.match(/^([0-9a-f-]+)\.(webp|jpg|png)$/);
  if (!match) return false;
  try {
    return (
      productImagePath(
        id,
        match[1],
        { webp: "image/webp", jpg: "image/jpeg", png: "image/png" }[match[2]]!,
      ) === path
    );
  } catch {
    return false;
  }
}

// Only our exact public bucket URL can be cleaned up. Commercial/external assets are preserved.
export function managedProductImagePath(
  url: string | null,
  base: string,
  id: string,
) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const prefix = `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`;
    if (
      parsed.origin !== new URL(base).origin ||
      parsed.search ||
      parsed.hash ||
      !parsed.pathname.startsWith(prefix)
    )
      return null;
    const path = parsed.pathname.slice(prefix.length);
    return isProductImagePath(path, id) ? path : null;
  } catch {
    return null;
  }
}

export function parseProductImageEdit(form: FormData) {
  const id = form.get("id");
  const updatedAt = form.get("updatedAt");
  const intent = form.get("intent");
  const path = form.get("path");
  const alt = form.get("imageAlt");
  if (
    typeof id !== "string" ||
    !/^[a-z0-9][a-z0-9-]{0,159}$/.test(id) ||
    typeof updatedAt !== "string" ||
    !Number.isFinite(Date.parse(updatedAt))
  )
    throw new Error("El producto es inválido. Actualizá el panel.");
  if (intent !== "replace" && intent !== "remove" && intent !== "alt")
    throw new Error("La operación de imagen es inválida.");
  if (typeof alt !== "string" || alt.length > 300)
    throw new Error("La descripción de la imagen admite hasta 300 caracteres.");
  if (intent === "replace" && !isProductImagePath(path, id))
    throw new Error("La ruta de imagen es inválida.");
  return {
    id,
    updatedAt,
    intent,
    path: intent === "replace" ? (path as string) : null,
    alt: alt.trim(),
  };
}

export type ProductImageResult = {
  ok: boolean;
  message: string;
  updatedAt?: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
};
