import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Owner-only admin page (route: /admin).
 *
 * Security is enforced in Postgres, not here: reading `waitlist` requires a
 * Supabase Auth session AND membership in the `admins` table (see migration
 * 002). This component just drives the login + display — even if someone loads
 * this page, the database returns nothing unless they are an allow-listed admin.
 */

type Row = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string | null;
  consent: boolean;
  locale: string;
  created_at: string;
};

const COLS: { key: keyof Row; label: string }[] = [
  { key: 'name', label: 'Nom' },
  { key: 'phone', label: 'Téléphone' },
  { key: 'email', label: 'Email' },
  { key: 'city', label: 'Ville' },
  { key: 'locale', label: 'Langue' },
  { key: 'consent', label: 'Consent.' },
  { key: 'created_at', label: 'Inscrit le' },
];

function cell(row: Row, key: keyof Row): string {
  const v = row[key];
  if (key === 'consent') return v ? 'Oui' : 'Non';
  if (key === 'created_at' && typeof v === 'string') {
    return new Date(v).toLocaleString('fr-FR');
  }
  return v == null ? '' : String(v);
}

function csvEscape(value: string): string {
  // Neutralise spreadsheet formula injection: a value starting with = + - @ tab
  // or CR can execute as a formula when the CSV is opened in Excel / Sheets.
  const guarded = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\n]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);

  // Guards against stale async results when the session changes mid-load.
  const reqRef = useRef(0);

  // Track the auth session.
  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadData = useCallback(async () => {
    if (!supabase || !session) return;
    const token = ++reqRef.current;
    setLoading(true);
    setLoadError('');
    // Confirm this account is authorised before requesting any personal data.
    const { data: admin, error: adminErr } = await supabase.rpc('is_admin');
    if (token !== reqRef.current) return; // a newer session/load superseded this one
    if (adminErr) {
      setIsAdmin(false);
      setLoadError(adminErr.message);
      setLoading(false);
      return;
    }
    if (!admin) {
      setIsAdmin(false);
      setRows(null);
      setLoading(false);
      return;
    }
    setIsAdmin(true);
    const { data, error } = await supabase
      .from('waitlist')
      .select('id,name,phone,email,city,consent,locale,created_at')
      .order('created_at', { ascending: false });
    if (token !== reqRef.current) return; // stale — discard this response
    setLoading(false);
    if (error) {
      setLoadError(error.message);
      setRows([]);
      return;
    }
    setRows((data ?? []) as Row[]);
  }, [session]);

  useEffect(() => {
    if (session) {
      // Clear any prior admin's data synchronously before the async check, so
      // stale rows/authorization can never render under a newly-changed session.
      setRows(null);
      setIsAdmin(null);
      loadData();
    } else {
      reqRef.current++; // invalidate any in-flight load
      setRows(null);
      setIsAdmin(null);
    }
  }, [session, loadData]);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setAuthError('');
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSigningIn(false);
    setPassword('');
    if (error) setAuthError(error.message);
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setRows(null);
    setIsAdmin(null);
  }

  function exportCsv() {
    if (!rows || rows.length === 0) return;
    const header = COLS.map((c) => c.key).join(',');
    const body = rows.map((r) => COLS.map((c) => csvEscape(cell(r, c.key))).join(',')).join('\n');
    const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yogom-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const shell = (children: ReactNode, wide = false) => (
    <div className="min-h-screen bg-sand">
      <div className={`mx-auto px-4 py-10 ${wide ? 'max-w-6xl' : 'max-w-sm'}`}>{children}</div>
    </div>
  );

  if (!isSupabaseConfigured || !supabase) {
    return shell(
      <div className="rounded-2xl border border-umber/15 bg-cream p-6 text-center">
        <p className="text-ink">La base de données n’est pas connectée.</p>
      </div>,
    );
  }

  if (!ready) {
    return shell(<p className="text-center text-umber">Chargement…</p>);
  }

  // Not logged in → login form.
  if (!session) {
    return shell(
      <div className="rounded-3xl border border-umber/15 bg-cream p-7 shadow-card">
        <h1 className="font-display text-2xl text-ink">YogOm · Admin</h1>
        <p className="mt-1 text-sm text-umber">Espace réservé — connexion requise.</p>
        <form onSubmit={handleSignIn} className="mt-5 space-y-3.5" noValidate>
          <input
            className="field"
            type="email"
            autoComplete="username"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="field"
            type="password"
            autoComplete="current-password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {authError && <p className="text-sm font-medium text-clay">{authError}</p>}
          <button type="submit" className="btn-primary w-full" disabled={signingIn}>
            {signingIn ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>,
    );
  }

  // Logged in but not an allow-listed admin.
  if (isAdmin === false) {
    return shell(
      <div className="rounded-3xl border border-umber/15 bg-cream p-7 text-center shadow-card">
        <p className="text-ink">Ce compte n’est pas autorisé à consulter les inscriptions.</p>
        <p className="mt-1 break-all text-sm text-umber">{session.user.email}</p>
        {loadError && <p className="mt-2 text-sm text-clay">{loadError}</p>}
        <button type="button" onClick={handleSignOut} className="btn-primary mt-5">
          Se déconnecter
        </button>
      </div>,
    );
  }

  // Session present but authorization not yet confirmed → neutral loading screen.
  // Never fall through to the admin view while isAdmin is null, so no stale data
  // or dashboard chrome can flash before the is_admin() check resolves.
  if (isAdmin !== true) {
    return shell(<p className="text-center text-umber">Chargement…</p>);
  }

  // Admin view.
  const count = rows?.length ?? 0;
  return shell(
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">YogOm · Inscriptions</h1>
          <p className="text-sm text-umber">
            {loading ? 'Chargement…' : `${count} inscription${count > 1 ? 's' : ''}`}
            {session.user.email ? ` · ${session.user.email}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={loadData} className="btn-ghost" disabled={loading}>
            Rafraîchir
          </button>
          <button type="button" onClick={exportCsv} className="btn-ghost" disabled={count === 0}>
            Exporter en CSV
          </button>
          <button type="button" onClick={handleSignOut} className="btn-primary">
            Se déconnecter
          </button>
        </div>
      </div>

      {loadError && <p className="mt-4 text-sm font-medium text-clay">{loadError}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-umber/15 bg-cream shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-umber/15 text-umber">
              <th className="px-4 py-3 font-semibold">#</th>
              {COLS.map((c) => (
                <th key={c.key} className="px-4 py-3 font-semibold">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {count === 0 && !loading && (
              <tr>
                <td colSpan={COLS.length + 1} className="px-4 py-8 text-center text-umber">
                  Aucune inscription pour l’instant.
                </td>
              </tr>
            )}
            {rows?.map((r, i) => (
              <tr key={r.id} className="border-b border-umber/10 last:border-0">
                <td className="px-4 py-3 text-umber">{i + 1}</td>
                {COLS.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-ink">
                    {cell(r, c.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>,
    true,
  );
}
