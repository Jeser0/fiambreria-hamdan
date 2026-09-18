export type WholesaleCategoryId = "quesos" | "fiambres" | "alimentos";

export type WholesaleProduct = {
  id: string;
  name: string;
  category: WholesaleCategoryId;
  description: string;
};

export const wholesaleCategories: Array<{
  id: WholesaleCategoryId;
  label: string;
  description: string;
}> = [
  {
    id: "quesos",
    label: "Quesos y lácteos",
    description: "Opciones para comercios, gastronomía y reventa.",
  },
  {
    id: "fiambres",
    label: "Fiambres",
    description: "Clásicos de mostrador para abastecimiento mayorista.",
  },
  {
    id: "alimentos",
    label: "Alimentos",
    description: "Sándwiches y pizzas para pedidos comerciales.",
  },
];

export const wholesaleProducts: WholesaleProduct[] = [
  {
    id: "cremoso-san-blas",
    name: "Cremoso San Blas",
    category: "quesos",
    description: "Consultar presentación, disponibilidad y precio vigente.",
  },
  {
    id: "cremoso-orcovi",
    name: "Cremoso Orcovi",
    category: "quesos",
    description: "Consultar presentación, disponibilidad y precio vigente.",
  },
  {
    id: "tybo-san-blas",
    name: "Tybo San Blas",
    category: "quesos",
    description: "Queso de uso versátil para mostrador, sándwiches y gastronomía.",
  },
  {
    id: "tybo-orcovi",
    name: "Tybo Orcovi",
    category: "quesos",
    description: "Consultar formato disponible y precio mayorista vigente.",
  },
  {
    id: "sardo-san-blas",
    name: "Sardo San Blas",
    category: "quesos",
    description: "Opción para rallar, gastronomía y venta fraccionada.",
  },
  {
    id: "mozzarella-orcovi",
    name: "Mozzarella Orcovi",
    category: "quesos",
    description: "Indicada para elaboración de pizzas y gastronomía.",
  },
  {
    id: "por-salut-san-blas",
    name: "Por Salut San Blas",
    category: "quesos",
    description: "Consultar presentación, disponibilidad y precio vigente.",
  },
  {
    id: "romano-orcovi",
    name: "Romano Orcovi",
    category: "quesos",
    description: "Consultar formato disponible y precio mayorista vigente.",
  },
  {
    id: "pategras-san-blas",
    name: "Pategrás San Blas",
    category: "quesos",
    description: "Consultar presentación, disponibilidad y precio vigente.",
  },
  {
    id: "ricota-silvia",
    name: "Ricota Silvia",
    category: "quesos",
    description: "Disponible para consulta comercial según stock vigente.",
  },
  {
    id: "roquefort-bavaria",
    name: "Roquefort Bavaria",
    category: "quesos",
    description: "Consultar presentación y disponibilidad al momento del pedido.",
  },
  {
    id: "roquefort-la-quesera",
    name: "Roquefort La Quesera",
    category: "quesos",
    description: "Consultar presentación y disponibilidad al momento del pedido.",
  },
  {
    id: "danbo-milkaut",
    name: "Danbo Milkaut",
    category: "quesos",
    description: "Consultar formato disponible y precio mayorista vigente.",
  },
  {
    id: "cremoso-ilolay",
    name: "Cremoso Ilolay",
    category: "quesos",
    description: "Consultar presentación, disponibilidad y precio vigente.",
  },
  {
    id: "cheddar-la-quesera",
    name: "Cheddar La Quesera",
    category: "quesos",
    description: "Consultar presentación y disponibilidad para gastronomía o reventa.",
  },
  {
    id: "proveleta-la-quesera",
    name: "Proveleta La Quesera",
    category: "quesos",
    description: "Consultar presentación y disponibilidad al momento del pedido.",
  },
  {
    id: "gruyere",
    name: "Gruyere",
    category: "quesos",
    description: "Consultar marca, presentación y disponibilidad vigente.",
  },
  {
    id: "jamon-cocido",
    name: "Jamón cocido",
    category: "fiambres",
    description: "Para mostrador, sándwiches y abastecimiento gastronómico.",
  },
  {
    id: "paleta-cocida",
    name: "Paleta cocida",
    category: "fiambres",
    description: "Alternativa para comercios, elaboración y reventa.",
  },
  {
    id: "salame",
    name: "Salame",
    category: "fiambres",
    description: "Consultar marcas, formatos disponibles y precio vigente.",
  },
  {
    id: "mortadela",
    name: "Mortadela",
    category: "fiambres",
    description: "Producto de mostrador sujeto a marca y disponibilidad vigente.",
  },
  {
    id: "sandwiches-x4-jamon-queso",
    name: "Sándwiches x4 — Jamón y queso",
    category: "alimentos",
    description: "Formato para reventa. Consultar cantidad mínima y precio vigente.",
  },
  {
    id: "sandwiches-x4-salame-queso",
    name: "Sándwiches x4 — Salame y queso",
    category: "alimentos",
    description: "Formato para reventa. Consultar cantidad mínima y precio vigente.",
  },
  {
    id: "sandwiches-x4-ternera-queso",
    name: "Sándwiches x4 — Ternera y queso",
    category: "alimentos",
    description: "Formato para reventa. Consultar cantidad mínima y precio vigente.",
  },
  {
    id: "sandwiches-x4-pollo",
    name: "Sándwiches x4 — Pollo, huevo y aceitunas",
    category: "alimentos",
    description: "Formato para reventa. Consultar cantidad mínima y precio vigente.",
  },
  {
    id: "sandwiches-x8",
    name: "Sándwiches de miga x8",
    category: "alimentos",
    description: "Consultar variedades disponibles, cantidades mínimas y precio vigente.",
  },
  {
    id: "pizzas",
    name: "Pizzas",
    category: "alimentos",
    description: "Consultar variedades disponibles, cantidad mínima y precio mayorista vigente.",
  },
];
