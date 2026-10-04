import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig: NextConfig = {
  async headers() {
    return ["/admin/:path*", "/api/:path*", "/pedido/:path*"].map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [new URL("/storage/v1/object/public/**", process.env.NEXT_PUBLIC_SUPABASE_URL)]
      : [],
  },
  reactCompiler: true,
  turbopack: {
    // Keep Next.js scoped to this app even if a parent folder contains
    // an accidental package-lock.json or another Node project.
    root: process.cwd(),
  },
};

export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) {
    const missing = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ].filter((name) => !process.env[name]?.trim());

    if (missing.length) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}. Configure them for the deployment environment before building.`,
      );
    }
  }

  return nextConfig;
}
