import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["universal-auth-nextjs"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
