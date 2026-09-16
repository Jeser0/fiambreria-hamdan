import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    // Keep Next.js scoped to this app even if a parent folder contains
    // an accidental package-lock.json or another Node project.
    root: process.cwd(),
  },
};

export default nextConfig;
