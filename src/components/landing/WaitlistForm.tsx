import { useState, type FormEvent } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useT, useLang } from '../../i18n';
import { LotusDraw, RangoliDivider } from './Motifs';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type Props = {
  /** Anchor id used by the sticky CTA to scroll here. */
  id?: string;
  /** Short line shown above the fields. */
  intro?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** French mobile/landline: 10 digits starting 0, accepting +33 / 0033 / bare forms. */
function normalizePhone(raw: string): string | null {
  let d = raw.replace(/[^\d]/g, '');
  if (d.startsWith('0033')) d = d.slice(4);
  else if (d.startsWith('33') && d.length === 11) d = d.slice(2);
  if (d.length === 9 && /^[1-9]/.test(d)) d = '0' + d;
  return /^0[1-9]\d{8}$/.test(d) ? '+33' + d.slice(1) : null;
}

export default function WaitlistForm({ id, intro }: Props) {
  const t = useT();
  const { lang } = useLang();
  const f = t.form;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string; consent?: string }>({});
  const [formError, setFormError] = useState('');

  function validate() {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = f.errors.name;
    if (!normalizePhone(phone)) next.phone = f.errors.phone;
    if (!EMAIL_RE.test(email.trim())) next.email = f.errors.email;
    if (!consent) next.consent = f.errors.consent;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    if (!isSupabaseConfigured || !supabase) {
      setFormError(f.errors.notConnected);
      return;
    }

    setStatus('submitting');
    const { error } = await supabase.from('waitlist').insert({
      name: name.trim(),
      phone: normalizePhone(phone),
      email: email.trim().toLowerCase(),
      city: city || null,
      consent: true,
      locale: lang,
    });

    if (error) {
      // 23505 = unique violation → this email already joined. Treat as success.
      if (error.code === '23505') {
        setStatus('success');
        return;
      }
      setStatus('error');
      setFormError(f.errors.generic);
      return;
    }
    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div
        id={id}
        className="rounded-3xl border border-sage/30 bg-cream p-7 text-center shadow-card sm:p-9"
      >
        <div className="mx-auto mb-4 h-16 w-16 text-sage">
          <LotusDraw className="h-full w-full" />
        </div>
        <h3 className="text-2xl text-ink">{f.successTitle}</h3>
        <p className="mx-auto mt-3 max-w-sm text-umber">{f.successBody}</p>
        <RangoliDivider className="mx-auto mt-5 h-5 w-20 text-clay" />
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-umber/15 bg-cream p-5 shadow-card sm:p-7"
    >
      {intro && <p className="mb-4 text-[15px] leading-snug text-umber">{intro}</p>}

      <div className="space-y-3.5">
        <div>
          <label htmlFor={`${id}-name`} className="sr-only">
            {f.namePh}
          </label>
          <input
            id={`${id}-name`}
            className="field"
            type="text"
            autoComplete="name"
            placeholder={f.namePh}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="mt-1 text-sm font-medium text-clay">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor={`${id}-phone`} className="sr-only">
            {f.phonePh}
          </label>
          <div className="flex items-stretch gap-2">
            <span className="inline-flex select-none items-center rounded-2xl border border-umber/25 bg-stone px-3 font-medium text-ink">
              +33
            </span>
            <input
              id={`${id}-phone`}
              className="field flex-1"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={!!errors.phone}
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm font-medium text-clay">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor={`${id}-email`} className="sr-only">
            {f.emailPh}
          </label>
          <input
            id={`${id}-email`}
            className="field"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={f.emailPh}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="mt-1 text-sm font-medium text-clay">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor={`${id}-city`} className="sr-only">
            {f.cityPh}
          </label>
          <select
            id={`${id}-city`}
            className="field text-ink"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">{f.cityPh}</option>
            {f.cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-[13px] leading-snug text-umber">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 flex-none accent-clay"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={!!errors.consent}
          />
          <span>{f.consent}</span>
        </label>
        {errors.consent && <p className="text-sm font-medium text-clay">{errors.consent}</p>}
      </div>

      {formError && <p className="mt-3 text-sm font-medium text-clay">{formError}</p>}

      <button type="submit" className="btn-primary mt-5 w-full text-base" disabled={status === 'submitting'}>
        {status === 'submitting' ? (
          <span className="inline-flex items-center gap-2">
            <RangoliDivider className="h-4 w-12 animate-pulse text-cream" />
            {f.submitting}
          </span>
        ) : (
          f.ctaLabel
        )}
      </button>

      <p className="mt-3 text-center text-[13px] leading-snug text-umber/85">{f.privacyNote}</p>
    </form>
  );
}
