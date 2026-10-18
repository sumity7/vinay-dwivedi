import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  async redirects() {
    return [
      { source: "/", destination: "/hi", permanent: false },
      /* the office portal lives outside the language routes: /en/admin and /hi/admin go to /admin */
      { source: "/:lang(hi|en)/admin", destination: "/admin", permanent: false },
    ];
  },
};

export default nextConfig;
