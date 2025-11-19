import React from 'react';

type Temperature = 'Hot Lead' | 'Warm Lead' | 'Cold Lead';

interface TemperatureBadgeProps {
  temperature: Temperature | null;
}

export function TemperatureBadge({ temperature }: TemperatureBadgeProps) {
  if (!temperature) return null;

  const styles = {
    'Hot Lead': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Warm Lead': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Cold Lead': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[temperature]}`}
    >
      {temperature}
    </span>
  );
}
