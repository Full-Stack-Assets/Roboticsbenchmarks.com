import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  generateBuildId: async () => process.env.ROBOTICSBENCHMARKS_BUILD_ID ?? "roboticsbenchmarks-v0.1.0",
};

export default nextConfig;
