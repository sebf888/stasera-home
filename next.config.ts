import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '260mb',
    },
  },
};

export default nextConfig;
