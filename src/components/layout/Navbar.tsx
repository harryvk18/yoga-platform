import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, Bell, ChevronDown, LogOut, User, Calendar, CreditCard, Clock, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AuthModal from '../auth/AuthModal';
import { formatDate } from '../../utils/ui';

const navLinks = [
  { label: 'Home',     to: '/' },
  { label: 'Centers',  to: '/centers' },
  { label: 'Pricing',  to: '/subscriptions' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, bookings } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdowns when the route changes
  useEffect(() => {
    setProfileOpen(false);
    setNotifOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const now = new Date();
  const upcomingNotifs = bookings
    .filter(b => b.status === 'confirmed' && new Date(b.session.date + 'T' + b.session.startTime) > now)
    .sort((a, b) => new Date(a.session.date + 'T' + a.session.startTime).getTime() - new Date(b.session.date + 'T' + b.session.startTime).getTime())
    .slice(0, 5);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">
                Serenity<span className="text-emerald-600">Hub</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.to
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isLoggedIn && user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    My Sessions
                  </Link>
                  {/* Notification bell */}
                  <div ref={notifRef} className="relative hidden sm:block">
                    <button
                      onClick={() => setNotifOpen(o => !o)}
                      className="relative flex w-9 h-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Bell className="w-4 h-4 text-gray-500" />
                      {upcomingNotifs.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                    {notifOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-[55] overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">Upcoming Sessions</p>
                          <Link to="/bookings" onClick={() => setNotifOpen(false)} className="text-xs text-emerald-600 hover:underline font-medium">View all</Link>
                        </div>
                        {upcomingNotifs.length === 0 ? (
                          <div className="px-4 py-6 text-center">
                            <p className="text-sm text-gray-400">No upcoming sessions booked.</p>
                            <Link to="/centers" onClick={() => setNotifOpen(false)} className="text-xs text-emerald-600 hover:underline mt-1 inline-block">Browse studios</Link>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                            {upcomingNotifs.map(b => (
                              <div key={b.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                <p className="text-sm font-medium text-gray-900 truncate">{b.session.title}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-emerald-500" />{formatDate(b.session.date)}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-500" />{b.session.startTime}</span>
                                </div>
                                <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5"><MapPin className="w-3 h-3" />{b.session.centerName}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Profile dropdown */}
                  <div ref={profileRef} className="relative">
                    <button
                      onClick={() => setProfileOpen(o => !o)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-[55]">
                        <div className="px-4 py-2 border-b border-gray-50">
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Calendar className="w-4 h-4 text-gray-400" /> Dashboard
                        </Link>
                        <Link to="/bookings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <User className="w-4 h-4 text-gray-400" /> My Bookings
                        </Link>
                        <Link to="/subscriptions" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <CreditCard className="w-4 h-4 text-gray-400" /> Subscription
                        </Link>
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <button onClick={() => setAuthOpen(true)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    Sign In
                  </button>
                  <button onClick={() => setAuthOpen(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(o => !o)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white py-3 px-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.to ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Dashboard
                </Link>
                <Link to="/bookings" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  My Bookings
                </Link>
                {/* Mobile upcoming sessions */}
                {upcomingNotifs.length > 0 && (
                  <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50 overflow-hidden">
                    <p className="text-xs font-semibold text-emerald-700 px-4 py-2 border-b border-emerald-100">
                      Upcoming sessions
                    </p>
                    {upcomingNotifs.slice(0, 3).map(b => (
                      <Link
                        key={b.id}
                        to="/bookings"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-100 transition-colors"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{b.session.title}</p>
                          <p className="text-xs text-gray-500">{formatDate(b.session.date)} · {b.session.startTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }} className="w-full mt-2 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                Get Started
              </button>
            )}
          </div>
        )}
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
