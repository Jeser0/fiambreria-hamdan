import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fiambrería Hamdan",
    short_name: "Hamdan",
    description: "Fiambrería Hamdan — tradición tucumana desde 1992.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf0",
    theme_color: "#8f1f23",
    lang: "es-AR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
