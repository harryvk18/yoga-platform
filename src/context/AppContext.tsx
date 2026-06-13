import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, Booking, Session, Center, SubscriptionPlan, ActiveSubscription } from '../types';
import { demoUser, initialBookings, centers as allCenters, subscriptionPlans } from '../data/mockData';

interface AppContextValue {
  user: User | null;
  isLoggedIn: boolean;
  bookings: Booking[];
  centers: Center[];
  plans: SubscriptionPlan[];
  login: (email: string, _password: string) => boolean;
  logout: () => void;
  bookSession: (session: Session, centerName: string, instructorName: string) => { success: boolean; message: string };
  cancelBooking: (bookingId: string) => void;
  rescheduleBooking: (bookingId: string, newSession: Session, centerName: string, instructorName: string) => void;
  changePlan: (plan: SubscriptionPlan) => void;
  cancelSubscription: () => void;
  isSessionBooked: (sessionId: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const login = useCallback((email: string, _password: string): boolean => {
    // Demo: accept any non-empty credentials, or match demo account
    if (email && _password) {
      setUser(demoUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const isSessionBooked = useCallback(
    (sessionId: string) =>
      bookings.some(b => b.sessionId === sessionId && b.status === 'confirmed'),
    [bookings]
  );

  const bookSession = useCallback(
    (session: Session, centerName: string, instructorName: string): { success: boolean; message: string } => {
      if (!user) return { success: false, message: 'Please log in to book a session.' };

      const sub = user.subscription;
      if (!sub || sub.status !== 'active') {
        return { success: false, message: 'You need an active subscription to book sessions.' };
      }

      const sessionsAllowedPerWeek = sub.plan.sessionsPerWeek;
      if (sub.sessionsUsedThisWeek >= sessionsAllowedPerWeek) {
        return { success: false, message: `Your plan allows ${sessionsAllowedPerWeek} sessions per week. Upgrade to book more.` };
      }

      if (session.bookedCount >= session.capacity) {
        return { success: false, message: 'Sorry, this session is fully booked.' };
      }

      if (isSessionBooked(session.id)) {
        return { success: false, message: 'You have already booked this session.' };
      }

      const newBooking: Booking = {
        id: `b_${Date.now()}`,
        userId: user.id,
        sessionId: session.id,
        status: 'confirmed',
        bookedAt: new Date().toISOString(),
        session: { ...session, centerName, instructorName },
      };

      setBookings(prev => [newBooking, ...prev]);
      setUser(prev =>
        prev && prev.subscription
          ? {
              ...prev,
              subscription: {
                ...prev.subscription,
                sessionsUsedThisWeek: prev.subscription.sessionsUsedThisWeek + 1,
                totalSessionsBooked: prev.subscription.totalSessionsBooked + 1,
              },
            }
          : prev
      );

      return { success: true, message: 'Session booked! See you on the mat.' };
    },
    [user, isSessionBooked]
  );

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    setUser(prev =>
      prev && prev.subscription
        ? {
            ...prev,
            subscription: {
              ...prev.subscription,
              sessionsUsedThisWeek: Math.max(0, prev.subscription.sessionsUsedThisWeek - 1),
            },
          }
        : prev
    );
  }, []);

  const rescheduleBooking = useCallback(
    (bookingId: string, newSession: Session, centerName: string, instructorName: string) => {
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId
            ? {
                ...b,
                sessionId: newSession.id,
                bookedAt: new Date().toISOString(),
                session: { ...newSession, centerName, instructorName },
              }
            : b
        )
      );
    },
    []
  );

  const changePlan = useCallback((plan: SubscriptionPlan) => {
    setUser(prev => {
      if (!prev) return prev;
      const today = new Date();
      const periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const newSub: ActiveSubscription = {
        id: `sub_${Date.now()}`,
        userId: prev.id,
        planId: plan.id,
        plan,
        status: 'active',
        currentPeriodStart: today.toISOString().split('T')[0],
        currentPeriodEnd: periodEnd.toISOString().split('T')[0],
        sessionsUsedThisWeek: 0,
        totalSessionsBooked: prev.subscription?.totalSessionsBooked ?? 0,
      };
      return { ...prev, subscription: newSub };
    });
  }, []);

  const cancelSubscription = useCallback(() => {
    setUser(prev =>
      prev && prev.subscription
        ? { ...prev, subscription: { ...prev.subscription, status: 'cancelled' } }
        : prev
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        bookings,
        centers: allCenters,
        plans: subscriptionPlans,
        login,
        logout,
        bookSession,
        cancelBooking,
        rescheduleBooking,
        changePlan,
        cancelSubscription,
        isSessionBooked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
