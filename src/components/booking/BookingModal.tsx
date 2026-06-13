import { useState } from 'react';
import { X, Clock, Users, MapPin, Star, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import type { Session } from '../../types';
import { useApp } from '../../context/AppContext';
import { centers } from '../../data/mockData';
import { TYPE_PILL, LEVEL_COLORS, formatDateLong } from '../../utils/ui';

interface Props {
  session: Session | null;
  onClose: () => void;
  onLoginRequest?: () => void;
}

export default function BookingModal({ session, onClose, onLoginRequest }: Props) {
  const { user, isLoggedIn, bookSession, isSessionBooked } = useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!session) return null;

  const center = centers.find(c => c.id === session.centerId);
  const instructor = center?.instructors.find(i => i.id === session.instructorId);
  const spotsLeft = session.capacity - session.bookedCount;
  const isFull = spotsLeft <= 0;
  const alreadyBooked = isSessionBooked(session.id);

  const handleBook = async () => {
    if (!center || !instructor) return;
    setLoading(true);
    // simulate short network delay
    await new Promise(r => setTimeout(r, 900));
    const res = bookSession(session, center.name, instructor.name);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-40 bg-gradient-to-br from-emerald-600 to-teal-700 p-6 flex flex-col justify-end">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${TYPE_PILL[session.type] ?? 'bg-white/20 text-white'}`}>
              {session.type}
            </span>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${LEVEL_COLORS[session.level]}`}>
              {session.level}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{session.title}</h2>
        </div>

        <div className="p-6">
          {result ? (
            /* Result state */
            <div className="flex flex-col items-center py-6 text-center">
              {result.success ? (
                <>
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-500 mb-1">{session.title}</p>
                  <p className="text-sm text-gray-400">{formatDateLong(session.date)} · {session.startTime}–{session.endTime}</p>
                  <p className="text-sm text-gray-400">{center?.name}</p>
                  <button onClick={onClose} className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors">
                    Done
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Failed</h3>
                  <p className="text-gray-500 text-sm">{result.message}</p>
                  <button onClick={onClose} className="mt-6 w-full py-3 bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors">
                    Close
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Session details */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{session.startTime}–{session.endTime} · {session.durationMin} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className={isFull ? 'text-red-500 font-medium' : spotsLeft <= 3 ? 'text-amber-600 font-medium' : ''}>
                    {isFull ? 'Fully booked' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{center?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-transparent flex-shrink-0" />
                  <span>{session.room}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-5">{session.description}</p>

              {/* Date */}
              <div className="bg-emerald-50 rounded-xl px-4 py-3 mb-5">
                <p className="text-sm font-semibold text-emerald-800">{formatDateLong(session.date)}</p>
                <p className="text-xs text-emerald-600 mt-0.5">{session.startTime} – {session.endTime}</p>
              </div>

              {/* Instructor */}
              {instructor && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-5">
                  <img src={instructor.avatar} alt={instructor.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{instructor.name}</p>
                    <p className="text-xs text-gray-500">{instructor.specializations.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-medium">{instructor.rating}</span>
                  </div>
                </div>
              )}

              {/* Subscription note */}
              {user?.subscription && (
                <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-4">
                  Used <strong className="text-gray-700">{user.subscription.sessionsUsedThisWeek}</strong> / {user.subscription.plan.sessionsPerWeek === 99 ? '∞' : user.subscription.plan.sessionsPerWeek} sessions this week ({user.subscription.plan.name} plan)
                </div>
              )}

              {/* CTA */}
              {!isLoggedIn ? (
                <button
                  onClick={() => { onClose(); onLoginRequest?.(); }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Sign In to Book
                </button>
              ) : alreadyBooked ? (
                <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 rounded-xl text-emerald-700 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Already booked
                </div>
              ) : (
                <button
                  onClick={handleBook}
                  disabled={loading || isFull}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" /> Confirming…
                    </>
                  ) : isFull ? 'Class Full' : 'Confirm Booking'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
