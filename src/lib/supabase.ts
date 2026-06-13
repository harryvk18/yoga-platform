import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client used only to INSERT waitlist sign-ups.
 * The anon key is safe to ship: a row-level-security insert-only policy
 * means it can add rows but never read the list back.
 *
 * Exported as nullable so the app degrades gracefully (shows a config
 * notice) instead of crashing when env vars are not yet set.
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(url && anonKey);
