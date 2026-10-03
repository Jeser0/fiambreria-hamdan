import { validateProductImageContents } from "./product-image";

// Browser APIs keep uploads small without adding a dependency or cropping the product.
export async function prepareProductImage(file: File): Promise<Blob> {
  await validateProductImageContents(file);
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("No pudimos leer la imagen. Elegí otro archivo.");
  }
  try {
    if (bitmap.width * bitmap.height > 40_000_000)
      throw new Error(
        "La imagen tiene demasiados píxeles. Elegí una de hasta 40 megapíxeles.",
      );
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const optimized = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85),
    );
    return optimized?.type === "image/webp" &&
      (scale < 1 || optimized.size < file.size)
      ? optimized
      : file;
  } finally {
    bitmap.close();
  }
}
