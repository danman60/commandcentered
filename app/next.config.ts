import type { NextConfig } from "next";
import path from "path";

// Generate build timestamp in EST
const estTime = new Date().toLocaleString('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  } as any,
  env: {
    NEXT_PUBLIC_BUILD_TIME: estTime,
    // Vercel automatically provides VERCEL_GIT_COMMIT_SHA
    // We expose it as NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA for client-side access
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_BUILD_HASH || 'dev',
  },
};

export default nextConfig;
