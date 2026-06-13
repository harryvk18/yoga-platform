export type YogaType =
  | 'Hatha'
  | 'Vinyasa'
  | 'Ashtanga'
  | 'Yin'
  | 'Kundalini'
  | 'Restorative'
  | 'Hot Yoga'
  | 'Meditation'
  | 'Power Yoga';

export type Level = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'pending';

export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';

export type PlanInterval = 'monthly' | 'quarterly' | 'yearly';

export interface Instructor {
  id: string;
  name: string;
  specializations: YogaType[];
  rating: number;
  reviewCount: number;
  avatar: string;
  bio: string;
  yearsExperience: number;
}

export interface Center {
  id: string;
  name: string;
  tagline: string;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  amenities: string[];
  instructors: Instructor[];
  description: string;
  yogaTypes: YogaType[];
  openingHours: string;
  phone: string;
  email: string;
}

export interface Session {
  id: string;
  centerId: string;
  instructorId: string;
  title: string;
  type: YogaType;
  date: string; // ISO date string yyyy-mm-dd
  startTime: string; // HH:mm
  endTime: string;
  durationMin: number;
  capacity: number;
  bookedCount: number;
  level: Level;
  description: string;
  room: string;
}

export interface Booking {
  id: string;
  userId: string;
  sessionId: string;
  status: BookingStatus;
  bookedAt: string;
  session: Session & { centerName: string; instructorName: string };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  interval: PlanInterval;
  sessionsPerWeek: number;
  features: string[];
  colorFrom: string;
  colorTo: string;
  popular?: boolean;
}

export interface ActiveSubscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  sessionsUsedThisWeek: number;
  totalSessionsBooked: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  subscription: ActiveSubscription | null;
}
