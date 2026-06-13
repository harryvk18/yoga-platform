import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, Phone, Mail, ChevronLeft, Users, CheckCircle, Calendar, ChevronRight } from 'lucide-react';
import { centers, sessions as allSessions } from '../data/mockData';
import BookingModal from '../components/booking/BookingModal';
import AuthModal from '../components/auth/AuthModal';
import type { Session } from '../types';
import { useApp } from '../context/AppContext';
import { TYPE_PILL, LEVEL_DOT } from '../utils/ui';

type Tab = 'schedule' | 'about' | 'instructors';

export default function CenterDetail() {
  const { id } = useParams<{ id: string }>();
  const { isSessionBooked } = useApp();
  const center = centers.find(c => c.id === id);

  // All hooks before any conditional return
  const [tab, setTab] = useState<Tab>('schedule');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const centerSessions = useMemo(
    () => allSessions.filter(s => s.centerId === (center?.id ?? '')),
    [center?.id]
  );

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      offset: i,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short' }),
      dateStr: d.toISOString().split('T')[0],
      dayNum: d.getDate(),
    };
  }), []);

  const defaultDay = useMemo(() => {
    const idx = days.findIndex(day => centerSessions.some(s => s.date === day.dateStr));
    return idx >= 0 ? idx : 0;
  }, [days, centerSessions]);

  const [selectedDay, setSelectedDay] = useState(() => defaultDay);

  if (!center) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Studio not found</h2>
          <Link to="/centers" className="text-emerald-600 hover:underline">Back to all studios</Link>
        </div>
      </div>
    );
  }

  const activeDateStr = days[selectedDay].dateStr;
  const daySessions = centerSessions
    .filter(s => s.date === activeDateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={center.image} alt={center.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link to="/centers" className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </Link>
        </div>
        <div className="absolute bottom-6 left-4 right-4 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-emerald-300 text-sm font-medium mb-1 italic">{center.tagline}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{center.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-white/90 text-sm">
                <MapPin className="w-4 h-4" /> {center.address}
              </div>
              <div className="flex items-center gap-1 text-amber-300 text-sm font-semibold">
                <Star className="w-4 h-4 fill-amber-300" /> {center.rating}
                <span className="text-white/60 font-normal ml-0.5">({center.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Amenity chips */}
        <div className="flex gap-2 flex-wrap py-4 border-b border-gray-100">
          {center.amenities.map(a => (
            <span key={a} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 shadow-sm">
              <CheckCircle className="w-3 h-3 text-emerald-500" /> {a}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 py-4 border-b border-gray-100">
          {(['schedule', 'about', 'instructors'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                tab === t ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="py-8">
          {/* ── Schedule Tab ── */}
          {tab === 'schedule' && (
            <div>
              {/* Day selector */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
                {days.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(i)}
                    className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      selectedDay === i
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-xs font-medium">{day.label}</span>
                    <span className="text-lg font-bold mt-0.5">{day.dayNum}</span>
                  </button>
                ))}
              </div>

              {daySessions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No sessions scheduled for this day.</p>
                  <p className="text-gray-400 text-sm mt-1">Check another day or explore other studios.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {daySessions.map(session => {
                    const instructor = center.instructors.find(i => i.id === session.instructorId);
                    const spotsLeft = session.capacity - session.bookedCount;
                    const isFull = spotsLeft <= 0;
                    const isBooked = isSessionBooked(session.id);

                    return (
                      <div
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-card hover:shadow-card-hover hover:border-emerald-200 transition-all cursor-pointer"
                      >
                        {/* Time block */}
                        <div className="text-center w-16 flex-shrink-0">
                          <p className="text-sm font-bold text-gray-900">{session.startTime}</p>
                          <p className="text-xs text-gray-400">{session.durationMin}m</p>
                        </div>

                        <div className="w-px h-10 bg-gray-100 flex-shrink-0" />

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_PILL[session.type] ?? 'bg-gray-100 text-gray-600'}`}>
                              {session.type}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <span className={`w-1.5 h-1.5 rounded-full ${LEVEL_DOT[session.level]}`} />
                              {session.level}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">{session.title}</p>
                          {instructor && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <img src={instructor.avatar} alt={instructor.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="text-xs text-gray-500">{instructor.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Spots & book */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className={`flex items-center gap-1 text-xs font-medium ${isFull ? 'text-red-500' : spotsLeft <= 3 ? 'text-amber-600' : 'text-gray-500'}`}>
                            <Users className="w-3.5 h-3.5" />
                            {isFull ? 'Full' : `${spotsLeft} left`}
                          </div>
                          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            isBooked
                              ? 'bg-emerald-100 text-emerald-700'
                              : isFull
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-emerald-600 text-white group-hover:bg-emerald-700'
                          } transition-colors`}>
                            {isBooked ? 'Booked' : isFull ? 'Full' : 'Book'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── About Tab ── */}
          {tab === 'about' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">About {center.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{center.description}</p>
                </div>

                {/* Gallery */}
                {center.gallery && center.gallery.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {center.gallery.map((url, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                          <img src={url} alt={`${center.name} gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Classes Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {center.yogaTypes.map(type => (
                      <span key={type} className={`text-sm font-medium px-3 py-1.5 rounded-xl ${TYPE_PILL[type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
                  <div className="space-y-2.5 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {center.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {center.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {center.email}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Opening Hours</h4>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {center.openingHours}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Instructors Tab ── */}
          {tab === 'instructors' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {center.instructors.map(instructor => {
                const instructorSessions = centerSessions.filter(
                  s => s.instructorId === instructor.id && new Date(s.date + 'T' + s.startTime) > new Date()
                );
                return (
                  <div key={instructor.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex flex-col items-center text-center">
                    <img src={instructor.avatar} alt={instructor.name} className="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-emerald-50" />
                    <h3 className="font-bold text-gray-900 text-lg">{instructor.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 mb-3">{instructor.yearsExperience} years experience</p>
                    <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                      {instructor.specializations.map(s => (
                        <span key={s} className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${TYPE_PILL[s] ?? 'bg-gray-100 text-gray-600'}`}>{s}</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{instructor.bio}</p>
                    <div className="flex items-center gap-1.5 text-amber-500 font-semibold mb-4">
                      <Star className="w-4 h-4 fill-amber-400" />
                      {instructor.rating}
                      <span className="text-gray-400 font-normal text-sm">({instructor.reviewCount} reviews)</span>
                    </div>
                    {instructorSessions.length > 0 && (
                      <button
                        onClick={() => { setTab('schedule'); }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {instructorSessions.length} upcoming session{instructorSessions.length !== 1 ? 's' : ''}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BookingModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        onLoginRequest={() => setAuthOpen(true)}
      />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
