import { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle, Loader, ShieldCheck } from 'lucide-react';
import type { SubscriptionPlan } from '../../types';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  plan: SubscriptionPlan | null;
  onClose: () => void;
}

function CardInput({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function PaymentModal({ plan, onClose }: Props) {
  const { changePlan, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form whenever a new plan is selected
  useEffect(() => {
    if (plan) {
      setStep('form');
      setCardNum('');
      setExpiry('');
      setCvc('');
      setCardName('');
      setErrors({});
    }
  }, [plan]);

  if (!plan) return null;

  const formatCardNum = (v: string) =>
    v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  const formatExpiry = (v: string) =>
    v.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!cardName.trim()) e.cardName = 'Name is required';
    if (cardNum.replace(/\s/g, '').length < 16) e.cardNum = 'Enter a valid 16-digit card number';
    if (expiry.length < 5) e.expiry = 'Enter MM/YY';
    if (cvc.length < 3) e.cvc = 'Enter 3-digit CVC';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('processing');
    await new Promise(r => setTimeout(r, 1800));
    changePlan(plan);
    setStep('success');
  };

  const handleDone = () => {
    onClose();
    navigate('/dashboard');
  };

  const INTERVAL_LABEL: Record<string, string> = {
    monthly: '/month',
    quarterly: '/quarter',
    yearly: '/year',
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={step === 'form' ? onClose : undefined} />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {step === 'success' ? (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
            <p className="text-gray-500 mb-1">
              Welcome to the <strong className="text-gray-800">{plan.name}</strong> plan
            </p>
            <p className="text-sm text-gray-400 mb-6">Your subscription is now active. Start booking sessions!</p>
            <button onClick={handleDone} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
              Go to Dashboard
            </button>
          </div>
        ) : step === 'processing' ? (
          <div className="p-16 flex flex-col items-center text-center">
            <Loader className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-lg font-semibold text-gray-800">Processing payment…</p>
            <p className="text-sm text-gray-400 mt-1">Please don't close this window.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Subscribe to {plan.name}</h2>
                <p className="text-sm text-gray-500">
                  <span className="text-2xl font-bold text-gray-900">£{plan.price}</span>
                  {INTERVAL_LABEL[plan.interval]}
                </p>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <CardInput label="Name on card">
                <input
                  type="text"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  placeholder="Alex Morgan"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.cardName ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.cardName && <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>}
              </CardInput>

              <CardInput label="Card number">
                <div className="relative">
                  <input
                    type="text"
                    value={cardNum}
                    onChange={e => setCardNum(formatCardNum(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    className={`w-full pl-4 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.cardNum ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.cardNum && <p className="text-xs text-red-500 mt-1">{errors.cardNum}</p>}
              </CardInput>

              <div className="grid grid-cols-2 gap-3">
                <CardInput label="Expiry">
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.expiry ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
                </CardInput>
                <CardInput label="CVC">
                  <input
                    type="text"
                    value={cvc}
                    onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    inputMode="numeric"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.cvc ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.cvc && <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>}
                </CardInput>
              </div>

              {!isLoggedIn && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  You need to be signed in to subscribe.
                </p>
              )}

              <button
                type="submit"
                disabled={!isLoggedIn}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Pay £{plan.price}{INTERVAL_LABEL[plan.interval]}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Payments secured by Stripe · Cancel anytime</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
