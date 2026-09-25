import { getCatalogSnapshot } from "@/lib/catalog-db";

export async function GET() {
  try {
    const catalog = await getCatalogSnapshot();

    return Response.json({
      ok: true,
      categories: catalog.categories.length,
      products: catalog.products.length,
      minimums: Object.fromEntries(
        catalog.categories.map((category) => [
          category.id,
          category.wholesaleMinimum,
        ]),
      ),
      firstProduct: catalog.products[0] ?? null,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al cargar el catálogo.",
      },
      { status: 500 },
    );
  }
}
