import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "ik.imagekit.io"
      },
      {
        protocol: 'https',
        hostname: "ferrous.app"
      },
      {
        protocol: 'https',
        hostname: "ferrous-v2.netlify.app"
      },
      {
        protocol: 'https',
        hostname: "res.cloudinary.com"
      }
    ]
  },
  experimental: {
    optimizePackageImports: ['gsap', 'lenis'],
  },
  async headers() {
    return [
      {
        source: '/fonts/Maesiez.otf',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'video/mp4',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
