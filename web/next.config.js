/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./srv/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [new URL("https://fiery-blackbird-477.convex.cloud/**")],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    cacheComponents: true,
  },
};

export default config;
