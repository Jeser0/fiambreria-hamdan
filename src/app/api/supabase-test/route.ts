import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const [
    { count: productCount, error: productsError },
    { count: categoryCount, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("categories")
      .select("id", { count: "exact", head: true }),
  ]);

  const error = productsError ?? categoriesError;

  if (error) {
    return Response.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 },
    );
  }

  return Response.json({
    ok: true,
    products: productCount,
    categories: categoryCount,
  });
}