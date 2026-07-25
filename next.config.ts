import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder catalog images used by prisma/seed.ts until real
      // product photography is uploaded via the admin panel (Phase 4).
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Supabase Storage public URLs for admin-uploaded product/banner images.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
