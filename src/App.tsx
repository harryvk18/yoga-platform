import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import Landing from './components/landing/Landing';
import Admin from './pages/Admin';

/**
 * Pre-launch bilingual (FR/EN) waitlist site for the France market.
 *  - "/"       → public waitlist landing (Landing)
 *  - "/admin"  → owner-only sign-ups dashboard (access enforced by Supabase RLS)
 * The full marketplace (centers, bookings, subscriptions) still lives in
 * src/pages and src/context for the post-launch build and is not routed yet.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <LanguageProvider>
              <Landing />
            </LanguageProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
