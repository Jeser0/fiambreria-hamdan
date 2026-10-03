import { requireAdmin } from "@/lib/admin-auth";
import { logout } from "./actions";
import ProductManager from "@/components/admin/ProductManager";

export default async function AdminPage() {
  const { supabase, user } = await requireAdmin();
  const [products, categories] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, name, category_id, retail_price, wholesale_price, active, in_stock, updated_at, image_url, image_alt",
      )
      .order("sort_order")
      .order("id"),
    supabase
      .from("categories")
      .select("id, name")
      .order("sort_order")
      .order("id"),
  ]);
  if (products.error || categories.error)
    throw new Error("No pudimos cargar los productos del panel.");
  return (
    <>
      <div className="mb-8 mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black text-[#742026]">
            Tus productos
          </h1>
          <p className="mt-2 text-sm text-[#796052]">{user.email}</p>
        </div>
        <form action={logout}>
          <button className="checkout-focus rounded-xl border border-[#8f1f23]/20 bg-white px-4 py-3 text-sm font-bold text-[#8f1f23]">
            Cerrar sesión
          </button>
        </form>
      </div>
      <ProductManager
        products={products.data ?? []}
        categories={categories.data ?? []}
      />
    </>
  );
}
