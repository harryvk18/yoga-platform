import { useState } from 'react';
import { CheckCircle, AlertCircle, Crown, Zap, Shield, ArrowRight, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { subscriptionPlans } from '../data/mockData';
import type { SubscriptionPlan } from '../types';
import PaymentModal from '../components/payment/PaymentModal';
import AuthModal from '../components/auth/AuthModal';

const PLAN_ICONS = [Shield, Zap, Crown];

const INTERVAL_LABEL: Record<string, string> = {
  monthly: '/month',
  quarterly: '/quarter',
  yearly: '/year',
};

const FAQ = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing period.',
  },
  {
    q: 'What happens to unused sessions?',
    a: 'Sessions reset at the start of each week. Unused sessions do not carry over to the next week.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Absolutely. Cancel anytime with no cancellation fees. You retain access until the end of your current billing period.',
  },
  {
    q: 'Are sessions transferable between studios?',
    a: 'Yes — your subscription is valid at all SerenityHub partner studios. One session counts regardless of which studio you visit.',
  },
];

export default function Subscriptions() {
  const { user, isLoggedIn, cancelSubscription } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const sub = user?.subscription;

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (!isLoggedIn) { setAuthOpen(true); return; }
    setSelectedPlan(plan);
  };

  const handleCancelSub = () => {
    cancelSubscription();
    setConfirmCancel(false);
  };

  const isCurrentPlan = (planId: string) => sub?.planId === planId && sub.status === 'active';

  const daysLeft = sub
    ? Math.ceil((new Date(sub.currentPeriodEnd).getTime() - Date.now()) / 86400000)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-3">Memberships</p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Choose your plan</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Flexible subscriptions to fit your practice. Access all partner studios, all class types — cancel anytime.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Current subscription banner */}
        {sub && sub.status === 'active' && (
          <div className={`bg-gradient-to-r ${sub.plan.colorFrom} ${sub.plan.colorTo} rounded-2xl p-6 mb-10 text-white`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-white/70 text-sm mb-1">Your current plan</p>
                <h2 className="text-2xl font-extrabold">{sub.plan.name} — £{sub.plan.price}/mo</h2>
                <p className="text-white/80 text-sm mt-1">
                  {sub.sessionsUsedThisWeek} of {sub.plan.sessionsPerWeek === 99 ? '∞' : sub.plan.sessionsPerWeek} sessions used this week
                  · Renews in {daysLeft} days
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl transition-colors border border-white/20"
                >
                  Cancel Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {sub && sub.status === 'cancelled' && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-10">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Your subscription has been cancelled. You can resubscribe below.
            </p>
          </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-14 py-4">
          {subscriptionPlans.map((plan, i) => {
            const Icon = PLAN_ICONS[i] ?? Shield;
            const isCurrent = isCurrentPlan(plan.id);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl overflow-hidden border transition-all ${
                  plan.popular
                    ? 'border-emerald-500 shadow-xl shadow-emerald-100/50 scale-105'
                    : 'border-gray-200 hover:border-emerald-300 hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="bg-emerald-600 text-white text-xs font-bold text-center py-2 tracking-widest uppercase">
                    ✦ Most Popular
                  </div>
                )}

                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${plan.colorFrom} ${plan.colorTo} p-7`}>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>
                  <p className="text-white/70 text-sm mt-0.5">{plan.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">£{plan.price}</span>
                    <span className="text-white/70">{INTERVAL_LABEL[plan.interval]}</span>
                  </div>
                  <p className="text-white/70 text-sm mt-1">
                    {plan.sessionsPerWeek === 99 ? 'Unlimited sessions per week' : `${plan.sessionsPerWeek} sessions per week`}
                  </p>
                </div>

                {/* Features */}
                <div className="bg-white p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <div className="w-full py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl text-center flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        plan.popular
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200'
                          : 'bg-gray-900 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {sub?.status === 'active' ? 'Switch to ' + plan.name : 'Get Started'} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="grid sm:grid-cols-3 gap-5 mb-14">
          {[
            { icon: Shield, title: 'Secure Payments', desc: 'All transactions are encrypted and processed securely via Stripe.' },
            { icon: Calendar, title: 'Cancel Anytime', desc: 'No lock-in contracts. Cancel your plan with a single click.' },
            { icon: Zap, title: 'Instant Access', desc: 'Your subscription is activated immediately after payment.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-card">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm">{item.q}</span>
                  <span className={`ml-4 flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel confirmation */}
      {confirmCancel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmCancel(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel subscription?</h3>
            <p className="text-sm text-gray-500 mb-6">
              You'll retain access until {sub ? new Date(sub.currentPeriodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmCancel(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                Keep Plan
              </button>
              <button onClick={handleCancelSub} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <PaymentModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
