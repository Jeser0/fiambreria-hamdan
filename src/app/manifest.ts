import type { MetadataRoute } from "next";
import { business } from "@/data/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name,
    short_name: "Hamdan",
    description: `${business.name} — tradición tucumana desde ${business.since}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf0",
    theme_color: "#8f1f23",
    lang: "es-AR",
    icons: [
      {
        src: "/icon.png",
        sizes: "150x150",
        type: "image/png",
      },
    ],
  };
}
