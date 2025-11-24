'use client';

export function BuildInfo() {
  // Use Vercel's built-in git commit SHA, fallback to custom env var, then 'dev'
  const commitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
                    process.env.NEXT_PUBLIC_BUILD_HASH ||
                    'dev';

  // Build time is injected at build time
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown';

  return (
    <div className="hidden md:block fixed bottom-2 right-2 text-xs text-slate-500 font-mono bg-slate-800/80 px-2 py-1 rounded border border-slate-700/50 z-50">
      Build: {commitSha.substring(0, 7)} | {buildTime} EST
    </div>
  );
}
