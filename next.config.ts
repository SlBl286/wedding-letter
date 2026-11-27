import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      config.cache = false;
    }
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("bun:sqlite", "node:sqlite");
    }
    return config;
  },
};

export default nextConfig;
