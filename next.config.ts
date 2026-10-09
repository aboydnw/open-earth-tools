import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/tools": ["./data/tools/*.json"],
  },
};

export default nextConfig;
