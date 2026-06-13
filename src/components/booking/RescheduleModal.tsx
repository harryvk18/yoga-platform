import { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import type { Booking, Session } from '../../types';
import { useApp } from '../../context/AppContext';
import { sessions as allSessions, centers } from '../../data/mockData';
import { TYPE_PILL, LEVEL_DOT, formatDate } from '../../utils/ui';

interface Props {
  booking: Booking | null;
  onClose: () => void;
}

export default function RescheduleModal({ booking, onClose }: Props) {
  const { rescheduleBooking, isSessionBooked } = useApp();
  const [selected, setSelected] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!booking) return null;

  const now = new Date();
  const center = centers.find(c => c.id === booking.session.centerId);
  const candidates = allSessions.filter(
    s =>
      s.centerId === booking.session.centerId &&
      s.id !== booking.sessionId &&
      new Date(s.date + 'T' + s.startTime) > now &&
      s.capacity - s.bookedCount > 0 &&
      !isSessionBooked(s.id)
  ).sort((a, b) =>
    new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime()
  );

  const handleConfirm = async () => {
    if (!selected || !center) return;
    const instructor = center.instructors.find(i => i.id === selected.instructorId);
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    rescheduleBooking(booking.id, selected, center.name, instructor?.name ?? '');
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />

      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Reschedule Session</h2>
            <p className="text-sm text-gray-500 truncate">{booking.session.title}</p>
          </div>
          <button onClick={onClose} disabled={loading} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {done ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rescheduled!</h3>
              <p className="text-gray-500 text-sm mb-1">{selected?.title}</p>
              <p className="text-sm text-gray-400">{selected && formatDate(selected.date)} · {selected?.startTime}–{selected?.endTime}</p>
              <button onClick={onClose} className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors">
                Done
              </button>
            </div>
          ) : candidates.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">No alternatives available</h3>
              <p className="text-sm text-gray-500">There are no other upcoming sessions at {center?.name} you can switch to right now.</p>
              <button onClick={onClose} className="mt-5 px-6 py-2.5 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">Pick a replacement session at <strong className="text-gray-800">{center?.name}</strong>:</p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {candidates.map(s => {
                  const instructor = center?.instructors.find(i => i.id === s.instructorId);
                  const spotsLeft = s.capacity - s.bookedCount;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelected(s)}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        selected?.id === s.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_PILL[s.type] ?? 'bg-gray-100 text-gray-600'}`}>{s.type}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <span className={`w-1.5 h-1.5 rounded-full ${LEVEL_DOT[s.level]}`} />
                            {s.level}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 truncate">{s.title}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(s.date)}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.startTime}–{s.endTime}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{spotsLeft} left</span>
                        </div>
                        {instructor && <p className="text-xs text-gray-400 mt-0.5">with {instructor.name}</p>}
                      </div>
                      {selected?.id === s.id && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selected || loading}
                className="mt-5 w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Rescheduling…</> : 'Confirm Reschedule'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
