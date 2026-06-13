import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useT } from '../../i18n';

/** Below this, we show "be among the first" instead of an awkward tiny number. */
const MIN_SHOW = 25;

type CountRow = { city: string | null; count: number | string };

/**
 * Honest social proof. Calls a SECURITY DEFINER function that returns only
 * aggregate counts (never personal rows), so it works under the insert-only
 * RLS policy. Renders a "be among the first" fallback when not configured,
 * on error, or while the list is still small.
 */
export default function WaitlistCounter({ className = '' }: { className?: string }) {
  const t = useT();
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let active = true;
    supabase
      .rpc('waitlist_counts')
      .then(({ data, error }: { data: CountRow[] | null; error: unknown }) => {
        if (!active || error || !data) return;
        setTotal(data.reduce((sum, r) => sum + Number(r.count ?? 0), 0));
      });
    return () => {
      active = false;
    };
  }, []);

  const label =
    total !== null && total >= MIN_SHOW
      ? t.counter.joined.replace('{n}', total.toLocaleString())
      : t.counter.beFirst;

  return (
    <div className={className}>
      <span className="inline-flex items-center gap-2 rounded-full border border-umber/20 bg-stone px-3.5 py-1.5 text-sm font-medium text-umber">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
        </span>
        {label}
      </span>
    </div>
  );
}
