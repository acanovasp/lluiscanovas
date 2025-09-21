import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization settings
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    qualities: [75, 90, 95], // Add quality settings
  },
  
  // Performance optimizations
  // experimental: {
  //   optimizeCss: true, // Disabled - requires additional dependencies
  // },
  
  // Enable gzip compression
  compress: true,
};

export default nextConfig;
