export type StoreMode = "mayorista" | "minorista";

export type CatalogCategoryId =
  | "quesos"
  | "fiambres"
  | "sandwich-x4"
  | "sandwich-x8"
  | "pizzas";

export type CatalogProduct = {
  id: string;
  name: string;
  category: CatalogCategoryId;
  retailPrice?: number;
  wholesalePrice?: number;
  wholesaleSamePrice?: boolean;
  image?: string;
  imageAlt?: string;
  active: boolean;
};

export const catalogCategories: Array<{
  id: CatalogCategoryId;
  label: string;
}> = [
  { id: "quesos", label: "Quesos y lácteos" },
  { id: "fiambres", label: "Fiambres" },
  { id: "sandwich-x4", label: "Sándwich x4" },
  { id: "sandwich-x8", label: "Sándwich x8" },
  { id: "pizzas", label: "Pizzas" },
];

export const wholesaleMinimums: Partial<Record<CatalogCategoryId, number>> = {
  "sandwich-x4": 20,
  "sandwich-x8": 40,
  pizzas: 20,
};

export const catalogProducts: CatalogProduct[] = [
  // Quesos y lácteos — precios tomados de la lista provista por Hamdan.
  { id: "cremoso-san-blas", name: "Cremoso San Blas", category: "quesos", retailPrice: 9000, wholesalePrice: 7700, active: true },
  { id: "cremoso-orcovi", name: "Cremoso Orcovi", category: "quesos", retailPrice: 10400, wholesalePrice: 9000, active: true },
  { id: "tybo-san-blas", name: "Tybo San Blas", category: "quesos", retailPrice: 11900, wholesalePrice: 10300, active: true },
  { id: "tybo-orcovi", name: "Tybo Orcovi", category: "quesos", retailPrice: 13640, wholesalePrice: 11700, active: true },
  { id: "sardo-san-blas", name: "Sardo San Blas", category: "quesos", retailPrice: 12300, wholesalePrice: 10700, active: true },
  { id: "mozzarella-orcovi", name: "Mozzarella Orcovi", category: "quesos", retailPrice: 12300, wholesalePrice: 10500, active: true },
  { id: "por-salut-san-blas", name: "Por Salut San Blas", category: "quesos", retailPrice: 10000, wholesalePrice: 9000, active: true },
  { id: "romano-orcovi", name: "Romano Orcovi", category: "quesos", retailPrice: 26600, wholesalePrice: 21300, active: true },
  { id: "pategras-san-blas", name: "Pategras San Blas", category: "quesos", retailPrice: 13800, wholesalePrice: 11960, active: true },
  { id: "ricota-silvia", name: "Ricota Silvia", category: "quesos", retailPrice: 4800, wholesalePrice: 4100, active: true },
  { id: "roquefort-bavaria", name: "Roquefort Bavaria", category: "quesos", retailPrice: 27200, wholesalePrice: 18700, active: true },
  { id: "danbo-milkaut", name: "Danbo Milkaut", category: "quesos", retailPrice: 20500, wholesalePrice: 17600, active: true },
  { id: "cremoso-ilolay", name: "Cremoso Ilolay", category: "quesos", retailPrice: 14900, wholesalePrice: 13000, active: true },
  { id: "cheddar-tybo-la-quesera", name: "Cheddar Tybo La Quesera", category: "quesos", retailPrice: 25300, wholesalePrice: 21700, active: true },
  { id: "gruyere", name: "Gruyere", category: "quesos", retailPrice: 37500, wholesalePrice: 32100, active: true },
  { id: "proveleta-la-quesera", name: "Proveleta La Quesera", category: "quesos", retailPrice: 30000, wholesalePrice: 26000, active: true },
  { id: "roquefort-la-quesera", name: "Roquefort La Quesera", category: "quesos", retailPrice: 22600, wholesalePrice: 19300, active: true },
  { id: "creman-doble-crema-light", name: "Creman Doble Crema / Light", category: "quesos", retailPrice: 17000, wholesalePrice: 14300, active: true },
  { id: "pategras-cerenisima", name: "Pategras Cerenísima", category: "quesos", retailPrice: 28800, wholesalePrice: 24000, active: true },
  { id: "danbo-cerenisima", name: "Danbo Cerenisima", category: "quesos", retailPrice: 23800, wholesalePrice: 20300, active: true },
  { id: "tybo-ilolay", name: "Tybo Ilolay", category: "quesos", retailPrice: 8591, wholesalePrice: 8591, wholesaleSamePrice: true, active: true },

  // Fiambres — catálogo basado en la lista de precios provista. El stock se podrá activar/desactivar desde datos/admin.
  { id: "pata-cerdo-piamontesa", name: "Pata de cerdo Piamontesa", category: "fiambres", retailPrice: 12000, wholesalePrice: 10300, active: true },
  { id: "jamon-cocido-paladini", name: "Jamón cocido Paladini", category: "fiambres", retailPrice: 23500, wholesalePrice: 20200, active: true },
  { id: "jamon-crudo-paladini", name: "Jamón crudo Paladini", category: "fiambres", retailPrice: 14399, wholesalePrice: 14399, wholesaleSamePrice: true, active: true },
  { id: "bondiola", name: "Bondiola", category: "fiambres", retailPrice: 38500, wholesalePrice: 33000, active: true },
  { id: "salame-milan-paladini", name: "Salame Milán Paladini", category: "fiambres", retailPrice: 33400, wholesalePrice: 28700, active: true },
  { id: "salame-crespon", name: "Salame crespón", category: "fiambres", retailPrice: 33400, wholesalePrice: 28700, active: true },
  { id: "panceta-ahumada", name: "Panceta ahumada", category: "fiambres", retailPrice: 23100, wholesalePrice: 19800, active: true },
  { id: "salchichon-triple-paladini", name: "Salchichón triple Paladini", category: "fiambres", retailPrice: 11700, wholesalePrice: 10000, active: true },
  { id: "queso-cerdo-paladini", name: "Queso de cerdo Paladini", category: "fiambres", retailPrice: 12900, wholesalePrice: 11000, active: true },
  { id: "jamon-natural", name: "Jamón natural", category: "fiambres", retailPrice: 30200, wholesalePrice: 25900, active: true },
  { id: "bondiola-tacural", name: "Bondiola Tacural", category: "fiambres", retailPrice: 27700, wholesalePrice: 22600, active: true },
  { id: "jamon-crudo-tacural", name: "Jamón crudo Tacural", category: "fiambres", retailPrice: 26000, wholesalePrice: 21700, active: true },
  { id: "mortadela-lario", name: "Mortadela Lario", category: "fiambres", retailPrice: 5674, wholesalePrice: 5674, wholesaleSamePrice: true, active: true },
  { id: "jamon-crudo-espuna", name: "Jamón crudo Espuña", category: "fiambres", retailPrice: 72200, wholesalePrice: 41745, active: true },
  { id: "jamon-cocido-piamontesa", name: "Jamón cocido Piamontesa", category: "fiambres", retailPrice: 14600, wholesalePrice: 12500, active: true },
  { id: "matambre-cacero", name: "Matambre cacero", category: "fiambres", retailPrice: 38000, wholesalePrice: 26257, active: true },
  { id: "cantimpalo-la-quintana", name: "Cantimpalo La Quintana", category: "fiambres", retailPrice: 24100, wholesalePrice: 20700, active: true },
  { id: "salame-mt-tacural", name: "Salame x mt Tacural", category: "fiambres", retailPrice: 26600, wholesalePrice: 21000, active: true },
  { id: "chorizo-colorado-la-quintana", name: "Chorizo colorado La Quintana", category: "fiambres", retailPrice: 24100, wholesalePrice: 20700, active: true },
  { id: "paleta-73", name: "Paleta 73", category: "fiambres", retailPrice: 6200, wholesalePrice: 5300, active: true },
  { id: "paleta-131-piamontesa", name: "Paleta 131 Piamontesa", category: "fiambres", retailPrice: 9000, wholesalePrice: 7700, active: true },
  { id: "ternera", name: "Ternera", category: "fiambres", retailPrice: 49000, wholesalePrice: 37900, active: true },

  // Sándwich x4.
  { id: "sandwich-x4-jamon-queso", name: "Jamón y queso", category: "sandwich-x4", retailPrice: 4500, wholesalePrice: 2250, active: true },
  { id: "sandwich-x4-salame-queso", name: "Salame y queso", category: "sandwich-x4", retailPrice: 4500, wholesalePrice: 2250, active: true },
  { id: "sandwich-x4-ternera-queso", name: "Ternera y queso", category: "sandwich-x4", retailPrice: 5000, wholesalePrice: 3000, active: true },

  // Sándwich x8.
  { id: "sandwich-x8-jamon-queso", name: "Jamón y queso", category: "sandwich-x8", retailPrice: 8000, wholesalePrice: 4500, active: true },
  { id: "sandwich-x8-salame-queso", name: "Salame y queso", category: "sandwich-x8", retailPrice: 8000, wholesalePrice: 4500, active: true },
  { id: "sandwich-x8-ternera-queso", name: "Ternera y queso", category: "sandwich-x8", retailPrice: 9900, wholesalePrice: 6000, active: true },
  { id: "sandwich-x8-pollo-huevo-aceitunas", name: "Pollo, huevo y aceitunas", category: "sandwich-x8", retailPrice: 11000, wholesalePrice: 6000, active: true },
  { id: "sandwich-x8-pollo-huevo-queso-morron", name: "Pollo, huevo, queso y morrón", category: "sandwich-x8", retailPrice: 11000, active: true },

  // Pizzas.
  { id: "pizza-muzzarella", name: "Muzzarella", category: "pizzas", retailPrice: 7000, wholesalePrice: 5000, active: true },
  { id: "pizza-jamon", name: "Jamón", category: "pizzas", retailPrice: 9900, wholesalePrice: 6500, active: true },
  { id: "pizza-bondiola", name: "Bondiola", category: "pizzas", retailPrice: 9900, wholesalePrice: 6500, active: true },
  { id: "pizza-cantimpalo", name: "Cantimpalo", category: "pizzas", retailPrice: 9900, wholesalePrice: 7800, active: true },
  { id: "pizza-ternera", name: "Ternera", category: "pizzas", retailPrice: 9900, wholesalePrice: 7800, active: true },
  { id: "pizza-cuatro-quesos", name: "4 Quesos", category: "pizzas", retailPrice: 9900, wholesalePrice: 6500, active: true },
];

export function productsForMode(
  mode: StoreMode,
  products: readonly CatalogProduct[] = catalogProducts,
) {
  return products.filter((product) => {
    if (!product.active) return false;

    return mode === "mayorista"
      ? typeof product.wholesalePrice === "number"
      : typeof product.retailPrice === "number";
  });
}

export function priceForMode(
  product: CatalogProduct,
  mode: StoreMode,
) {
  return mode === "mayorista"
    ? product.wholesalePrice
    : product.retailPrice;
}