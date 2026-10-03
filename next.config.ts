import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
