import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: true, // true = 308 (永久), false = 307 (暫時)
      },
    ];
  },
};

export default nextConfig;
