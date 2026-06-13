import { useEffect, useRef, useState, type RefObject } from 'react';
import WaitlistForm from './WaitlistForm';
import WaitlistCounter from './WaitlistCounter';
import { LotusMark, MandalaRings, RangoliDivider, FeatureIcon } from './Motifs';
import { BRAND_NAME } from '../../config';
import { useT, useLang, type Lang } from '../../i18n';

function scrollToJoin() {
  document.getElementById('join')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Show the sticky mobile CTA once the hero has scrolled out of view. */
function useScrolledPast(ref: RefObject<HTMLElement>) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setPast(!entry.isIntersecting), {
      threshold: 0,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return past;
}

function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1 text-sm font-semibold" role="group" aria-label="Language">
      {(['fr', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            lang === l ? 'bg-clay text-cream' : 'text-umber hover:text-ink'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 flex-none text-sage" aria-hidden="true">
      <path
        d="M4 10.5l4 4 8-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Landing() {
  const t = useT();
  const heroRef = useRef<HTMLElement>(null);
  const showSticky = useScrolledPast(heroRef);

  return (
    <div className="overflow-x-hidden">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <header ref={heroRef} className="relative isolate overflow-hidden bg-sand">
        <div className="warm-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] text-clay/[0.05]"
          aria-hidden="true"
        >
          <MandalaRings className="h-full w-full" />
        </div>

        <div className="section relative z-10 flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5">
            <LotusMark className="h-8 w-8 text-clay" />
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              {BRAND_NAME}
            </span>
          </div>
          <LanguageToggle />
        </div>

        <div className="section relative z-10 grid items-center gap-10 pb-16 pt-4 sm:pt-8 lg:grid-cols-2 lg:gap-14 lg:pb-24">
          <div className="animate-rise">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 className="mt-3 text-balance text-[2.5rem] leading-[1.06] sm:text-6xl">
              {t.hero.headline}
              <span className="mt-1 block text-clay">{t.hero.headlineAccent}</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-umber">{t.hero.subhead}</p>

            <ul className="mt-5 flex flex-wrap gap-2.5">
              {t.hero.chips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-umber/20 bg-stone px-3.5 py-1.5 text-sm font-medium text-ink"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden="true" />
                  {chip}
                </li>
              ))}
            </ul>

            <WaitlistCounter className="mt-5" />
          </div>

          <div className="animate-rise [animation-delay:.12s]">
            <WaitlistForm id="join-hero" intro={t.hero.formIntro} />
          </div>
        </div>
      </header>

      {/* ─────────────── VALUE STRIP (free · accessible · no-engagement) ─────────────── */}
      <section className="bg-sage text-cream">
        <div className="section py-10">
          <div className="grid gap-7 sm:grid-cols-3">
            {t.valueStrip.map((v) => (
              <div key={v.label} className="text-center sm:text-left">
                <p className="font-display text-xl text-cream">{v.label}</p>
                <p className="mt-1.5 text-cream/90">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── HOW IT WORKS ─────────────────────── */}
      <section className="bg-sand">
        <div className="section py-16 sm:py-20">
          <div className="text-center">
            <p className="eyebrow">{t.how.eyebrow}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">{t.how.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-umber">{t.how.intro}</p>
          </div>

          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.how.steps.map((s, i) => (
              <li key={s.title}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-clay font-display text-lg font-semibold text-clay">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-1.5 text-umber">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────────── WHY DIFFERENT + FLEXIBILITY ───────────────── */}
      <section className="bg-stone">
        <div className="section py-16 sm:py-20">
          <div className="text-center">
            <p className="eyebrow">{t.why.eyebrow}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">{t.why.title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-umber">{t.why.intro}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.why.features.map((feat) => (
              <div
                key={feat.title}
                className="rounded-3xl border border-umber/15 bg-cream p-7 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
              >
                <div className="h-12 w-12 text-clay">
                  <FeatureIcon name={feat.icon as 'euro' | 'mukta' | 'lotus'} className="h-full w-full" />
                </div>
                <h3 className="mt-5 text-2xl">{feat.title}</h3>
                <p className="mt-2 text-umber">{feat.body}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-sage/25 bg-cream p-7 shadow-card">
            <h3 className="text-center text-2xl">{t.why.flexTitle}</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {t.why.flexPoints.map((p) => (
                <li key={p} className="flex gap-2.5 text-umber">
                  <Check />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────────── PRICING + FOUNDING MEMBER ───────────────── */}
      <section className="bg-sand">
        <div className="section py-16 sm:py-20">
          <div className="text-center">
            <p className="eyebrow">{t.pricing.eyebrow}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">{t.pricing.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-umber">{t.pricing.intro}</p>
          </div>

          <div className="mx-auto mt-12 grid max-w-2xl gap-5 sm:grid-cols-2">
            {t.pricing.plans.map((p) => (
              <div
                key={p.code}
                className={`relative flex flex-col rounded-3xl border bg-stone p-6 shadow-card ${
                  p.popular ? 'border-clay ring-1 ring-clay' : 'border-umber/15'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-clay px-3 py-1 text-xs font-semibold text-cream">
                    ★
                  </span>
                )}
                <p className="eyebrow">{p.code}</p>
                <p className="mt-1 font-display text-lg text-ink">{p.name}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl text-ink">{p.price}</span>
                  <span className="text-sm text-umber">{p.cadence}</span>
                </div>
                {p.note && <p className="mt-1 text-xs font-medium text-clay">{p.note}</p>}
                <p className="mt-3 flex-1 text-sm text-umber">{p.blurb}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm font-medium text-sage">{t.pricing.noCard}</p>

          {/* founding member callout */}
          <div className="mt-12 overflow-hidden rounded-3xl bg-forest text-cream">
            <div className="p-8 sm:p-10">
              <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <p className="eyebrow text-amber">{t.pricing.founding.eyebrow}</p>
                  <h3 className="mt-2 text-3xl text-cream">{t.pricing.founding.title}</h3>
                  <ul className="mt-5 space-y-2.5">
                    {t.pricing.founding.perks.map((perk) => (
                      <li key={perk} className="flex gap-2.5 text-cream/90">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-amber" aria-hidden="true" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-cream/80">{t.pricing.founding.cityLine}</p>
                  <button type="button" onClick={scrollToJoin} className="btn-primary mt-5 w-full sm:w-auto">
                    {t.form.ctaLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── FAQ ───────────────────────── */}
      <section className="bg-stone">
        <div className="section max-w-3xl py-16 sm:py-20">
          <div className="text-center">
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">{t.faq.title}</h2>
          </div>
          <div className="mt-10 divide-y divide-umber/15 overflow-hidden rounded-3xl border border-umber/15 bg-cream">
            {t.faq.items.map((item) => (
              <details key={item.q} className="group px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="flex-none text-2xl font-light text-clay transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="-mt-1 pb-5 text-umber">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── FINAL WAITLIST ───────────────────── */}
      <section className="bg-sand">
        <div className="section max-w-xl py-16 text-center sm:py-20">
          <RangoliDivider className="mx-auto h-5 w-20 text-clay" />
          <h2 className="mt-5 text-3xl sm:text-4xl">{t.finalForm.title}</h2>
          <p className="mx-auto mt-3 max-w-md text-umber">{t.finalForm.intro}</p>
          <WaitlistCounter className="mt-5 flex justify-center" />
          <div className="mt-8 text-left">
            <WaitlistForm id="join" />
          </div>
        </div>
      </section>

      {/* ───────────────────────── FOOTER ───────────────────────── */}
      <footer className="bg-forest text-cream">
        <div className="section py-14 pb-28 md:pb-14">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2.5">
              <LotusMark className="h-9 w-9 text-amber" />
              <span className="font-display text-2xl font-semibold text-cream">{BRAND_NAME}</span>
            </div>
            <p className="max-w-md text-cream/85">{t.footer.mission}</p>
            <button type="button" onClick={scrollToJoin} className="btn-primary mt-2">
              {t.form.ctaLabel}
            </button>
          </div>
          <div className="mt-10 border-t border-cream/15 pt-6 text-center text-sm text-cream/70">
            <p>{t.footer.tagline}</p>
            <p className="mt-2">
              © {BRAND_NAME} · {t.footer.originLine}
            </p>
          </div>
        </div>
      </footer>

      {/* ──────────────── STICKY MOBILE CTA ──────────────── */}
      <div
        className={`safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-sand/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
          showSticky ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button type="button" onClick={scrollToJoin} className="btn-primary w-full">
          {t.form.ctaShort}
        </button>
      </div>
    </div>
  );
}
