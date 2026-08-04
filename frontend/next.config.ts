import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "react-icons",
      "react-icons/fa",
      "react-icons/si",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 82],
    minimumCacheTTL: 31536000,
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [32, 48, 54, 64, 72, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
      {
        source: "/:path*.(mp4|mov|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
        ],
      },
      {
        source: "/:path*.(jpg|jpeg|png|webp|avif|svg|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/salim",
        destination: "/products/salim-luxury-attar",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
