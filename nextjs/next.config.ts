import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    qualities: [75, 100],
    remotePatterns: [
      // Docker: next/image server fetches from Laravel via internal hostname
      {
        protocol: "http",
        hostname: "laravel",
        port: "8000",
        pathname: "/**",
      },
      // Local dev (without Docker): next/image server and Laravel both on localhost
      {
        protocol: "http",
        hostname: "**",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
