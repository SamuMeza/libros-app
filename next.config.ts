import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['26.237.25.193'],
  turbopack: {
    root: '.',
  },
  images: {
    remotePatterns: [
      // Placeholders usados en el seed de desarrollo
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Cloudinary — imágenes de producción
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
