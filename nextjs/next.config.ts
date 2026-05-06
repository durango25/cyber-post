import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    qualities: [75, 100],
    remotePatterns: [
      // Docker: next/image server fetches from Laravel via internal hostname
      {
        protocol: 'http',
        hostname: 'laravel',
        port: '8000',
        pathname: '/**',
      },
      // Local dev (without Docker): next/image server and Laravel both on localhost
      // {
      //   protocol: 'http',
      //   hostname: '**',
      //   port: '8000',
      //   pathname: '/**',
      // },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'cyber-post.test',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
