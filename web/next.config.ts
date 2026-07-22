import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Gera um servidor Node mínimo em .next/standalone para imagens Docker enxutas.
  output: "standalone",
  reactCompiler: true,
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.0.103:3000",
  ],
};

export default nextConfig;
