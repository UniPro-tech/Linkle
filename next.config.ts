import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // eslintのlint checkをbuild時にoff
    ignoreDuringBuilds: true,
  },
  typescript: {
    // type checkをbuild時にoff
    ignoreBuildErrors: true,
  },
  experimental: {
    authInterrupts: true,
  },
  images: {
    domains: ["drive.google.com"],
  },
  transpilePackages: ['mui-file-input'],
};

export default nextConfig;
