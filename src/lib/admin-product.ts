import type { Database } from "./supabase/database.types";

export type AdminProduct = Pick<
  Database["public"]["Tables"]["products"]["Row"],
  | "id"
  | "name"
  | "category_id"
  | "retail_price"
  | "wholesale_price"
  | "active"
  | "in_stock"
  | "updated_at"
>;
export type AdminCategory = { id: string; name: string };
export type ProductEditResult = {
  ok: boolean;
  message: string;
  updatedAt?: string;
};

export function parseAdminPrice(value: unknown): number | null {
  if (value === "") return null;
  if (typeof value !== "string" || !/^\d{1,9}(?:[.,]\d{1,2})?$/.test(value))
    throw new Error(
      "Ingresá un precio válido, mayor o igual a cero, con hasta dos decimales. Dejá vacío para no vender en esa tienda.",
    );
  const number = Number(value.replace(",", "."));
  if (!Number.isFinite(number) || number < 0 || number > 999999999.99)
    throw new Error("El precio está fuera del rango permitido.");
  return number;
}

export function parseProductEdit(form: FormData) {
  const id = form.get("id");
  const updatedAt = form.get("updatedAt");
  if (
    typeof id !== "string" ||
    !id.length ||
    id.length > 160 ||
    typeof updatedAt !== "string" ||
    !Number.isFinite(Date.parse(updatedAt))
  )
    throw new Error("El producto es inválido. Actualizá el panel.");
  const retail = parseAdminPrice(form.get("retailPrice"));
  const wholesale = parseAdminPrice(form.get("wholesalePrice"));
  if (retail === null && wholesale === null)
    throw new Error(
      "Ingresá al menos un precio. Para retirar el producto de ambas tiendas, desactivá el producto.",
    );
  const boolean = (name: string) => {
    const value = form.get(name);
    if (value !== null && value !== "on")
      throw new Error("El estado del producto es inválido.");
    return value === "on";
  };
  return {
    id,
    updatedAt,
    changes: {
      retail_price: retail,
      wholesale_price: wholesale,
      wholesale_same_price:
        retail !== null && wholesale !== null && retail === wholesale,
      active: boolean("active"),
      in_stock: boolean("inStock"),
    },
  };
}
