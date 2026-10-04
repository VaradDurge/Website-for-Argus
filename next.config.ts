import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // ponytail: the persistent dev cache grew to 668MB and kept next-server
    // pinned at ~700% CPU compacting it. A cold compile without it is ~5s.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
