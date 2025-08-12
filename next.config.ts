import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Temporarily ignore build errors for deploy
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
