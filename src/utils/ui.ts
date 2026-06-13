export const TYPE_PILL: Record<string, string> = {
  Vinyasa: 'bg-blue-100 text-blue-700',
  Hatha: 'bg-green-100 text-green-700',
  Ashtanga: 'bg-orange-100 text-orange-700',
  Yin: 'bg-purple-100 text-purple-700',
  Kundalini: 'bg-yellow-100 text-yellow-700',
  Restorative: 'bg-pink-100 text-pink-700',
  'Hot Yoga': 'bg-red-100 text-red-700',
  Meditation: 'bg-teal-100 text-teal-700',
  'Power Yoga': 'bg-amber-100 text-amber-700',
};

export const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-100',
  Advanced: 'bg-red-50 text-red-700 border-red-100',
  'All Levels': 'bg-gray-50 text-gray-600 border-gray-100',
};

export const LEVEL_DOT: Record<string, string> = {
  Beginner: 'bg-emerald-400',
  Intermediate: 'bg-amber-400',
  Advanced: 'bg-red-400',
  'All Levels': 'bg-gray-400',
};

export function formatDate(dateStr: string, style: 'short' | 'long' = 'short'): string {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-GB', {
    weekday: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    month: 'short',
    ...(style === 'short' ? { year: 'numeric' } : {}),
  });
}

export function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}
