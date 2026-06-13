import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, MapPin, ChevronRight, Zap, AlertCircle, CheckCircle2, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TYPE_PILL, formatDate } from '../utils/ui';

export default function Dashboard() {
  const { user, isLoggedIn, bookings } = useApp();
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in required</h2>
          <p className="text-gray-500 mb-6">Please sign in to access your dashboard.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const sub = user.subscription;
  const now = new Date();
  const upcomingBookings = bookings
    .filter(b => b.status === 'confirmed' && new Date(b.session.date + 'T' + b.session.startTime) > now)
    .sort((a, b) => {
      const da = new Date(a.session.date + 'T' + a.session.startTime);
      const db = new Date(b.session.date + 'T' + b.session.startTime);
      return da.getTime() - db.getTime();
    })
    .slice(0, 5);

  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  const daysUntilRenewal = sub
    ? Math.ceil((new Date(sub.currentPeriodEnd).getTime() - Date.now()) / 86400000)
    : 0;

  const sessionsLeft: string | number = sub
    ? sub.plan.sessionsPerWeek === 99
      ? '∞'
      : sub.plan.sessionsPerWeek - sub.sessionsUsedThisWeek
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-white/30 object-cover" />
              <div>
                <p className="text-emerald-200 text-sm">Welcome back,</p>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-emerald-200 text-sm mt-0.5">{user.email}</p>
              </div>
            </div>
            <Link to="/centers" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold transition-colors">
              <Calendar className="w-4 h-4" /> Book a Session
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Sessions this week',
              value: sub?.sessionsUsedThisWeek ?? 0,
              sub: `of ${sub?.plan.sessionsPerWeek === 99 ? '∞' : sub?.plan.sessionsPerWeek ?? 0} allowed`,
              icon: Calendar,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
            },
            {
              label: 'Remaining this week',
              value: sessionsLeft,
              sub: 'sessions available',
              icon: Zap,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
            },
            {
              label: 'Total sessions',
              value: sub?.totalSessionsBooked ?? 0,
              sub: 'all time',
              icon: TrendingUp,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'Completed',
              value: completedCount,
              sub: 'classes done',
              icon: CheckCircle2,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
            },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{card.value}</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">{card.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming bookings */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">Upcoming Sessions</h2>
              <Link to="/bookings" className="flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-700">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {upcomingBookings.length === 0 ? (
              <div className="p-10 text-center">
                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium mb-1">No upcoming sessions</p>
                <p className="text-gray-400 text-sm mb-4">Browse studios and book your next class.</p>
                <Link to="/centers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-sm">
                  Browse Studios
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    {/* Date badge */}
                    <div className="w-12 text-center flex-shrink-0">
                      <p className="text-xs text-emerald-600 font-semibold">{formatDate(booking.session.date)}</p>
                      <p className="text-sm font-bold text-gray-900">{booking.session.startTime}</p>
                    </div>

                    <div className="w-px h-8 bg-gray-100 flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_PILL[booking.session.type] ?? 'bg-gray-100 text-gray-600'}`}>
                          {booking.session.type}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 truncate">{booking.session.title}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{booking.session.centerName}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.session.durationMin} min</span>
                      </div>
                    </div>

                    <Link to="/bookings" className="flex-shrink-0 p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subscription card */}
          <div className="space-y-4">
            {sub ? (
              <div className={`bg-gradient-to-br ${sub.plan.colorFrom} ${sub.plan.colorTo} rounded-2xl p-6 text-white`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/70 text-sm">Active Plan</p>
                    <h3 className="text-xl font-bold mt-0.5">{sub.plan.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${sub.status === 'active' ? 'bg-white/20 text-white' : 'bg-red-400/50 text-white'}`}>
                    {sub.status}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-white/70 text-sm">Weekly sessions</p>
                  <p className="text-3xl font-extrabold">
                    {sub.sessionsUsedThisWeek}
                    <span className="text-lg font-medium text-white/60">
                      /{sub.plan.sessionsPerWeek === 99 ? '∞' : sub.plan.sessionsPerWeek}
                    </span>
                  </p>
                </div>

                {/* Progress bar */}
                {sub.plan.sessionsPerWeek !== 99 && (
                  <div className="mb-4">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all"
                        style={{ width: `${Math.min(100, (sub.sessionsUsedThisWeek / sub.plan.sessionsPerWeek) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="text-xs text-white/70">Renews in {daysUntilRenewal} days · £{sub.plan.price}/mo</div>

                <Link to="/subscriptions" className="mt-4 block text-center py-2.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl transition-colors">
                  Manage Plan
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 text-center">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">No active plan</h3>
                <p className="text-sm text-gray-500 mb-4">Subscribe to start booking sessions.</p>
                <Link to="/subscriptions" className="block w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-sm">
                  View Plans
                </Link>
              </div>
            )}

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Quick Actions</h4>
              <div className="space-y-2">
                {[
                  { label: 'Browse Studios', to: '/centers', icon: MapPin },
                  { label: 'My Bookings', to: '/bookings', icon: Calendar },
                  { label: 'Manage Subscription', to: '/subscriptions', icon: Star },
                ].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-colors text-sm font-medium group"
                  >
                    <item.icon className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
                    {item.label}
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300 group-hover:text-emerald-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
