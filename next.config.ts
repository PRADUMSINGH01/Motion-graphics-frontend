import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── Performance ── */
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  /* ── Image optimization ── */
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  /* ── Headers for caching static assets ── */
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /* ── Experimental optimizations ── */
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
