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
    description: "Sánguchitos y pizzas para pedidos comerciales.",
  },
];

export const wholesaleProducts: WholesaleProduct[] = [
  {
    id: "cremoso-san-blas",
    name: "Cremoso San Blas",
    category: "quesos",
    description: "Queso cremoso para mostrador, gastronomía y elaboración.",
  },
  {
    id: "tybo",
    name: "Queso Tybo",
    category: "quesos",
    description: "Una opción versátil para sándwiches, cocina y reventa.",
  },
  {
    id: "x-salud",
    name: "Queso X Salud",
    category: "quesos",
    description: "Disponible para consulta comercial y pedidos por volumen.",
  },
  {
    id: "sardo",
    name: "Queso Sardo para rallar",
    category: "quesos",
    description: "Ideal para gastronomía, almacenes y venta fraccionada.",
  },
  {
    id: "pategras",
    name: "Pategrás / Cáscara Roja",
    category: "quesos",
    description: "Consultar presentación, disponibilidad y precio vigente.",
  },
  {
    id: "jamon-cocido",
    name: "Pata de cerdo / Jamón cocido",
    category: "fiambres",
    description: "Para mostrador, sándwiches y abastecimiento gastronómico.",
  },
  {
    id: "paleta-cocida",
    name: "Paleta cocida",
    category: "fiambres",
    description: "Alternativa práctica para comercios y elaboración.",
  },
  {
    id: "salame",
    name: "Salame San Francisco / El Familiar",
    category: "fiambres",
    description: "Consultar disponibilidad de marcas y presentaciones.",
  },
  {
    id: "mortadela-paladini",
    name: "Mortadela Paladini",
    category: "fiambres",
    description: "Producto para mostrador y pedidos comerciales.",
  },
  {
    id: "sandwiches-x4",
    name: "Sándwiches de miga x4",
    category: "alimentos",
    description: "Pedidos mayoristas sujetos a variedad y cantidad mínima vigente.",
  },
  {
    id: "sandwiches-x8",
    name: "Sándwiches de miga x8",
    category: "alimentos",
    description: "Formato pensado para reventa, eventos y gastronomía.",
  },
  {
    id: "pizzas",
    name: "Pizzas",
    category: "alimentos",
    description: "Consultar variedades disponibles, cantidad y precio mayorista.",
  },
];
