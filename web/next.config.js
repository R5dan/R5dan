/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [new URL("https://fiery-blackbird-477.convex.cloud/**")],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  cacheComponents: true,
  experimental: {
    cacheLife: {
      year: {
        stale: 60 * 60 * 24 * 365,
      },
    },
  },
  reactCompiler: true,
  turbopack: {
    root: ".",
  },
};

export default config;
