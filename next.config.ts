import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jackpot.bet",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
