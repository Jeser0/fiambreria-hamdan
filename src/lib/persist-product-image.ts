import { managedProductImagePath } from "./product-image";

// Storage and Postgres are separate operations. Never delete an old object before
// the conditional product update succeeds, or roll back a save after cleanup fails.
export async function persistProductImage({
  id,
  baseUrl,
  oldUrl,
  newUrl,
  save,
  remove,
}: {
  id: string;
  baseUrl: string;
  oldUrl: string | null;
  newUrl: string | null;
  save: () => Promise<string | null>;
  remove: (path: string) => Promise<boolean>;
}) {
  const updatedAt = await save();
  if (!updatedAt) return { updatedAt: null, cleanupFailed: false };
  const oldPath = managedProductImagePath(oldUrl, baseUrl, id);
  let cleanupFailed = false;
  if (oldPath && oldUrl !== newUrl) {
    try {
      cleanupFailed = !(await remove(oldPath));
    } catch {
      cleanupFailed = true;
    }
  }
  return { updatedAt, cleanupFailed };
}
