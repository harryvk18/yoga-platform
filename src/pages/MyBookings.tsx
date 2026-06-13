import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, X, RefreshCw, CheckCircle2, AlertTriangle, Loader, Filter, ArrowLeftRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Booking, BookingStatus } from '../types';
import { TYPE_PILL, formatDate } from '../utils/ui';
import RescheduleModal from '../components/booking/RescheduleModal';

const STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; text: string; Icon: React.ComponentType<{ className?: string }> }> = {
  confirmed: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', Icon: CheckCircle2 },
  completed: { label: 'Completed', bg: 'bg-blue-50', text: 'text-blue-700', Icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-500', Icon: X },
  pending:   { label: 'Pending',   bg: 'bg-amber-50', text: 'text-amber-700', Icon: AlertTriangle },
};

type Filter = 'all' | BookingStatus;


export default function MyBookings() {
  const { bookings, cancelBooking, isLoggedIn } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in required</h2>
          <Link to="/" className="text-emerald-600 hover:underline">Go to home</Link>
        </div>
      </div>
    );
  }

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter);
  const counts: Record<Filter, number> = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    pending: bookings.filter(b => b.status === 'pending').length,
  };

  const handleCancelConfirm = async (id: string) => {
    setCancellingId(id);
    await new Promise(r => setTimeout(r, 700));
    cancelBooking(id);
    setCancellingId(null);
    setConfirmCancelId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-2">Account</p>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">View and manage all your class reservations.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {(['all', 'confirmed', 'completed', 'cancelled', 'pending'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                filter === f
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
              }`}
            >
              <span className="capitalize">{f}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings found</h3>
            <p className="text-gray-400 text-sm mb-6">
              {filter === 'all' ? "You haven't booked any sessions yet." : `No ${filter} bookings.`}
            </p>
            <Link to="/centers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-sm">
              Browse Studios
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(booking => {
              const statusCfg = STATUS_CONFIG[booking.status];
              const isPast = new Date(booking.session.date + 'T' + booking.session.endTime) < new Date();
              const canCancel = booking.status === 'confirmed' && !isPast;

              return (
                <div key={booking.id} className={`bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden transition-all ${booking.status === 'cancelled' ? 'opacity-60' : 'hover:shadow-card-hover'}`}>
                  <div className="flex items-stretch">
                    {/* Left accent */}
                    <div className={`w-1.5 flex-shrink-0 ${
                      booking.status === 'confirmed' ? 'bg-emerald-500' :
                      booking.status === 'completed' ? 'bg-blue-400' :
                      booking.status === 'cancelled' ? 'bg-red-300' : 'bg-amber-400'
                    }`} />

                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_PILL[booking.session.type] ?? 'bg-gray-100 text-gray-600'}`}>
                              {booking.session.type}
                            </span>
                            <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                              <statusCfg.Icon className="w-3 h-3" />
                              {statusCfg.label}
                            </span>
                          </div>

                          <h3 className="font-bold text-gray-900 text-base truncate">{booking.session.title}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">with {booking.session.instructorName}</p>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-500" />{formatDate(booking.session.date)}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-500" />{booking.session.startTime}–{booking.session.endTime}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-500" />{booking.session.centerName}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        {canCancel && (
                          <div className="flex-shrink-0">
                            {confirmCancelId === booking.id ? (
                              <div className="flex flex-col items-end gap-2">
                                <p className="text-xs text-red-600 font-medium whitespace-nowrap">Cancel this session?</p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setConfirmCancelId(null)}
                                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                  >
                                    Keep
                                  </button>
                                  <button
                                    onClick={() => handleCancelConfirm(booking.id)}
                                    disabled={cancellingId === booking.id}
                                    className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium flex items-center gap-1"
                                  >
                                    {cancellingId === booking.id ? <Loader className="w-3 h-3 animate-spin" /> : null}
                                    Yes, cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1.5">
                                <button
                                  onClick={() => setRescheduleBooking(booking)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <ArrowLeftRight className="w-3.5 h-3.5" /> Reschedule
                                </button>
                                <button
                                  onClick={() => setConfirmCancelId(booking.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" /> Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {booking.status === 'confirmed' && isPast && (
                          <span className="flex-shrink-0 text-xs text-gray-400 italic">Past</span>
                        )}
                      </div>

                      {booking.session.room && (
                        <p className="text-xs text-gray-400 mt-2">Room: {booking.session.room} · {booking.session.durationMin} min · {booking.session.level}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Book more CTA */}
        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-lg">Want to book more sessions?</h3>
            <p className="text-emerald-100 text-sm">Browse our partner studios and find your next class.</p>
          </div>
          <Link to="/centers" className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors text-sm">
            <RefreshCw className="w-4 h-4" /> Browse Studios
          </Link>
        </div>
      </div>

      <RescheduleModal booking={rescheduleBooking} onClose={() => setRescheduleBooking(null)} />
    </div>
  );
}
