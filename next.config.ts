import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['26.237.25.193'],
  turbopack: {
    root: '.',
  },
};

export default nextConfig;
