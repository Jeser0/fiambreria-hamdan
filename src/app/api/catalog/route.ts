import { getCatalogSnapshot } from "@/lib/catalog-db";

export async function GET() {
  try {
    return Response.json(await getCatalogSnapshot(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "No pudimos actualizar el catálogo. Intentá nuevamente." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
