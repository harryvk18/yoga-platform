import { LanguageProvider } from './i18n';
import Landing from './components/landing/Landing';

/**
 * Pre-launch bilingual (FR/EN) waitlist site for the France market.
 * The full marketplace (centers, bookings, subscriptions, dashboard) lives in
 * src/pages and src/context and is kept for the post-launch build — it is
 * intentionally not routed yet, so only the waitlist landing ships today.
 */
export default function App() {
  return (
    <LanguageProvider>
      <Landing />
    </LanguageProvider>
  );
}
