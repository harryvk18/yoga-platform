import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, MapPin, CheckCircle, Users, Building2, Calendar, Zap, Shield, Heart } from 'lucide-react';
import { centers, subscriptionPlans } from '../data/mockData';
import PaymentModal from '../components/payment/PaymentModal';
import type { SubscriptionPlan } from '../types';
import { useApp } from '../context/AppContext';
import AuthModal from '../components/auth/AuthModal';

const STATS = [
  { value: '5+', label: 'Partner Studios' },
  { value: '20+', label: 'Expert Instructors' },
  { value: '1,200+', label: 'Happy Members' },
  { value: '150+', label: 'Weekly Sessions' },
];

const HOW_IT_WORKS = [
  {
    icon: Shield,
    step: '01',
    title: 'Choose a Plan',
    desc: 'Pick a subscription that fits your lifestyle — from casual weekly sessions to unlimited practice.',
  },
  {
    icon: Calendar,
    step: '02',
    title: 'Browse & Book',
    desc: 'Explore real-time schedules across all partner studios and book your spot in seconds.',
  },
  {
    icon: Heart,
    step: '03',
    title: 'Practice & Grow',
    desc: 'Show up, roll out your mat, and let our world-class instructors guide your journey.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'SerenityHub transformed how I practice. I now visit three different studios each week and my practice has never been stronger.',
    author: 'Natalie R.',
    role: 'Flow Plan member · 8 months',
    avatar: 'https://i.pravatar.cc/80?img=20',
  },
  {
    quote: 'Booking is so easy — I can see live availability and reserve my spot in under 30 seconds. Game changer for busy mornings.',
    author: 'Tom H.',
    role: 'Unlimited Plan member · 1 year',
    avatar: 'https://i.pravatar.cc/80?img=7',
  },
  {
    quote: 'Love being able to try different styles at different studios all under one subscription. Totally worth it.',
    author: 'Aisha M.',
    role: 'Starter Plan member · 4 months',
    avatar: 'https://i.pravatar.cc/80?img=27',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const handlePlanClick = (plan: SubscriptionPlan) => {
    if (!isLoggedIn) { setAuthOpen(true); return; }
    setSelectedPlan(plan);
  };

  const INTERVAL_LABEL: Record<string, string> = { monthly: '/mo', quarterly: '/qtr', yearly: '/yr' };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 80%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-emerald-100 mb-8">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              Now in 5 cities across the UK
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Your yoga community,<br />
              <span className="text-amber-300">everywhere you go</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 leading-relaxed mb-10 max-w-xl">
              One subscription. Access to premium yoga studios near you. Book classes, track your practice, and find your flow — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/subscriptions')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold rounded-2xl text-base transition-all shadow-lg shadow-amber-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="/centers"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-2xl text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Browse Studios
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-sm text-emerald-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How SerenityHub works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-emerald-500 tracking-widest uppercase">{item.step}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Centers ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-2">Our network</p>
              <h2 className="text-3xl font-bold text-gray-900">Featured studios</h2>
            </div>
            <Link to="/centers" className="hidden sm:flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.slice(0, 3).map(center => (
              <Link
                key={center.id}
                to={`/centers/${center.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={center.image} alt={center.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-amber-600">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {center.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">{center.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1 mb-3">
                    <MapPin className="w-3.5 h-3.5" /> {center.city} · {center.address.split(',')[0]}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {center.yogaTypes.slice(0, 3).map(type => (
                      <span key={type} className="text-xs px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">{type}</span>
                    ))}
                    {center.yogaTypes.length > 3 && (
                      <span className="text-xs px-2 py-0.5 text-gray-400">+{center.yogaTypes.length - 3} more</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/centers" className="inline-flex items-center gap-2 text-emerald-600 font-medium">
              View all studios <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-3">Flexible plans</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">One subscription, all studios</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Cancel or change your plan at any time. No long-term commitments.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto py-4">
            {subscriptionPlans.map(plan => (
              <div
                key={plan.id}
                className={`relative rounded-2xl overflow-hidden border transition-all ${
                  plan.popular ? 'border-emerald-500 shadow-lg shadow-emerald-100 scale-105' : 'border-gray-200 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="bg-emerald-600 text-white text-xs font-bold text-center py-1.5 tracking-wider uppercase">
                    Most Popular
                  </div>
                )}
                <div className={`bg-gradient-to-br ${plan.colorFrom} ${plan.colorTo} p-6 text-white`}>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-white/80 text-sm mt-0.5">{plan.tagline}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold">£{plan.price}</span>
                    <span className="text-white/80 text-sm">{INTERVAL_LABEL[plan.interval]}</span>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      plan.popular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-900 hover:bg-gray-700 text-white'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-3">Community love</p>
            <h2 className="text-3xl font-bold text-gray-900">What our members say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-700 leading-relaxed italic mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-teal-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to start your journey?</h2>
          <p className="text-emerald-200 mb-8 text-lg">Join thousands of practitioners across the UK. First 7 days on us.</p>
          <button
            onClick={() => navigate('/subscriptions')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold rounded-2xl shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Explore Plans <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <PaymentModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
