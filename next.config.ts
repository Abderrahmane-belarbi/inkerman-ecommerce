import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Use 'http' if needed
        hostname: 'utfs.io',
      },
    ],
  },
};

export default nextConfig;
