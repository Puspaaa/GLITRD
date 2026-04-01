import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "GLITRD";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves from /GLITRD/ subdirectory
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
  },
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
