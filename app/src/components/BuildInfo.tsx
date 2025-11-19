'use client';

export function BuildInfo() {
  const buildHash = process.env.NEXT_PUBLIC_BUILD_HASH || 'dev';
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown';

  return (
    <div className="fixed bottom-2 right-2 text-xs text-slate-500 font-mono bg-slate-800/80 px-2 py-1 rounded border border-slate-700/50 z-50">
      Build: {buildHash.substring(0, 7)} | {buildTime} EST
    </div>
  );
}
