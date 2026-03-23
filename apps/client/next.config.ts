import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },

  transpilePackages: ["@shared/types"],
};

export default nextConfig;