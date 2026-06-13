import type {
  Center, Session, SubscriptionPlan, User, Booking
} from '../types';

// ---------------------------------------------------------------------------
// Helper — dates relative to today so the calendar always shows live data
// ---------------------------------------------------------------------------
const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];

const dayOffset = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return fmt(d);
};

// ---------------------------------------------------------------------------
// Instructors (embedded in centers)
// ---------------------------------------------------------------------------
const instructors = {
  maya: {
    id: 'i1',
    name: 'Maya Patel',
    specializations: ['Vinyasa', 'Hatha'] as const,
    rating: 4.9,
    reviewCount: 312,
    avatar: 'https://i.pravatar.cc/150?img=47',
    bio: 'Maya brings 12 years of studio experience blending breath-work with fluid movement sequences.',
    yearsExperience: 12,
  },
  leo: {
    id: 'i2',
    name: 'Leo Fernandez',
    specializations: ['Ashtanga', 'Power Yoga'] as const,
    rating: 4.8,
    reviewCount: 245,
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Leo trained in Mysore, India and specialises in traditional Ashtanga sequencing.',
    yearsExperience: 9,
  },
  sara: {
    id: 'i3',
    name: 'Sara Kim',
    specializations: ['Yin', 'Restorative', 'Meditation'] as const,
    rating: 5.0,
    reviewCount: 187,
    avatar: 'https://i.pravatar.cc/150?img=45',
    bio: 'Sara creates deeply nourishing classes that weave mindfulness into every posture.',
    yearsExperience: 7,
  },
  james: {
    id: 'i4',
    name: 'James Okafor',
    specializations: ['Hot Yoga', 'Power Yoga'] as const,
    rating: 4.7,
    reviewCount: 198,
    avatar: 'https://i.pravatar.cc/150?img=15',
    bio: 'James is a certified Bikram instructor with a passion for athletic performance yoga.',
    yearsExperience: 11,
  },
  priya: {
    id: 'i5',
    name: 'Priya Nair',
    specializations: ['Kundalini', 'Meditation', 'Hatha'] as const,
    rating: 4.9,
    reviewCount: 221,
    avatar: 'https://i.pravatar.cc/150?img=44',
    bio: 'Priya bridges ancient Kundalini traditions with modern therapeutic approaches.',
    yearsExperience: 14,
  },
};

// ---------------------------------------------------------------------------
// Centers
// ---------------------------------------------------------------------------
export const centers: Center[] = [
  {
    id: 'c1',
    name: 'Lotus Bloom Studio',
    tagline: 'Where breath meets movement',
    city: 'London',
    address: '14 Garden Lane, Shoreditch, London E1 6RF',
    rating: 4.9,
    reviewCount: 438,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
    ],
    amenities: ['Showers', 'Changing Rooms', 'Mat Rental', 'Props', 'Juice Bar', 'Parking', 'Lockers'],
    instructors: [instructors.maya, instructors.sara],
    description:
      'A serene urban sanctuary nestled in the heart of Shoreditch. Lotus Bloom offers premium studio spaces flooded with natural light, specialist instructors, and a welcoming community for all levels.',
    yogaTypes: ['Hatha', 'Vinyasa', 'Yin', 'Meditation'],
    openingHours: 'Mon–Fri 6:30am–9pm, Sat–Sun 8am–6pm',
    phone: '+44 20 7946 0958',
    email: 'hello@lotusbloom.co.uk',
  },
  {
    id: 'c2',
    name: 'Flow State Yoga',
    tagline: 'Find your flow, every day',
    city: 'Manchester',
    address: '52 Northern Quarter, Manchester M4 1EG',
    rating: 4.8,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80',
    ],
    amenities: ['Showers', 'Changing Rooms', 'Mat Rental', 'Café', 'WiFi', 'Lockers'],
    instructors: [instructors.leo, instructors.james],
    description:
      'Flow State is Manchester's premier dynamic yoga studio. Our expert instructors guide you through vigorous, energising sequences designed to build strength and mental clarity.',
    yogaTypes: ['Ashtanga', 'Power Yoga', 'Hot Yoga', 'Vinyasa'],
    openingHours: 'Mon–Fri 6am–9pm, Sat–Sun 7am–7pm',
    phone: '+44 161 496 0231',
    email: 'info@flowstateyoga.co.uk',
  },
  {
    id: 'c3',
    name: 'Tranquil Roots',
    tagline: 'Restore, heal and reconnect',
    city: 'Bristol',
    address: '8 Clifton Village, Bristol BS8 4AH',
    rating: 4.9,
    reviewCount: 267,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    gallery: [],
    amenities: ['Showers', 'Herbal Tea Bar', 'Props', 'Mat Rental', 'Garden Space'],
    instructors: [instructors.priya, instructors.sara],
    description:
      'Tucked in the leafy streets of Clifton Village, Tranquil Roots specialises in therapeutic and restorative practices. A perfect escape for those seeking deep relaxation and healing.',
    yogaTypes: ['Kundalini', 'Yin', 'Restorative', 'Meditation'],
    openingHours: 'Mon–Sat 7am–8pm, Sun 8am–5pm',
    phone: '+44 117 946 0441',
    email: 'namaste@tranquilroots.co.uk',
  },
  {
    id: 'c4',
    name: 'Urban Zen Studio',
    tagline: 'Power, precision, presence',
    city: 'London',
    address: '37 City Road, London EC1V 1RY',
    rating: 4.7,
    reviewCount: 509,
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80',
    gallery: [],
    amenities: ['Showers', 'Changing Rooms', 'Towel Service', 'Protein Bar', 'AC', 'Lockers', 'Parking'],
    instructors: [instructors.james, instructors.leo],
    description:
      'Urban Zen is the go-to destination for high-performance yoga. With state-of-the-art heated studios and industry-leading instructors, every class pushes your limits.',
    yogaTypes: ['Hot Yoga', 'Power Yoga', 'Ashtanga', 'Vinyasa'],
    openingHours: 'Mon–Fri 5:30am–10pm, Sat–Sun 7am–8pm',
    phone: '+44 20 7946 1142',
    email: 'book@urbanzen.co.uk',
  },
  {
    id: 'c5',
    name: 'The Mindful Space',
    tagline: 'Breathe deeper. Live better.',
    city: 'Edinburgh',
    address: '21 Grassmarket, Edinburgh EH1 2HR',
    rating: 4.8,
    reviewCount: 194,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    gallery: [],
    amenities: ['Showers', 'Meditation Room', 'Props', 'Tea Lounge', 'WiFi'],
    instructors: [instructors.priya, instructors.maya],
    description:
      'Edinburgh's most beloved mindfulness studio. The Mindful Space combines yoga, breathwork and meditation in a cosy, welcoming environment for complete beginners to advanced practitioners.',
    yogaTypes: ['Hatha', 'Meditation', 'Kundalini', 'Yin'],
    openingHours: 'Mon–Sun 7am–8pm',
    phone: '+44 131 496 0783',
    email: 'hello@mindfulspace.co.uk',
  },
];

// ---------------------------------------------------------------------------
// Sessions — current week + next 3 days
// ---------------------------------------------------------------------------
export const sessions: Session[] = [
  // --- Lotus Bloom (c1)
  { id: 's1',  centerId: 'c1', instructorId: 'i1', title: 'Morning Vinyasa Flow', type: 'Vinyasa',    date: dayOffset(0), startTime: '07:00', endTime: '08:00', durationMin: 60,  capacity: 16, bookedCount: 12, level: 'All Levels',   description: 'Start your day with an energising flow linking breath to movement.',     room: 'Studio A' },
  { id: 's2',  centerId: 'c1', instructorId: 'i3', title: 'Yin & Restore',        type: 'Yin',         date: dayOffset(0), startTime: '18:30', endTime: '19:45', durationMin: 75,  capacity: 14, bookedCount: 9,  level: 'All Levels',   description: 'Deep connective-tissue stretches held for 3–5 minutes each.',           room: 'Studio B' },
  { id: 's3',  centerId: 'c1', instructorId: 'i1', title: 'Hatha Foundations',    type: 'Hatha',       date: dayOffset(1), startTime: '09:00', endTime: '10:00', durationMin: 60,  capacity: 18, bookedCount: 6,  level: 'Beginner',     description: 'Master the fundamentals of alignment and breath.',                      room: 'Studio A' },
  { id: 's4',  centerId: 'c1', instructorId: 'i3', title: 'Midday Meditation',    type: 'Meditation',  date: dayOffset(1), startTime: '12:00', endTime: '12:30', durationMin: 30,  capacity: 20, bookedCount: 11, level: 'All Levels',   description: 'A guided 30-minute lunch-break reset for clarity and calm.',            room: 'Studio B' },
  { id: 's5',  centerId: 'c1', instructorId: 'i1', title: 'Power Vinyasa',        type: 'Vinyasa',     date: dayOffset(2), startTime: '06:30', endTime: '07:30', durationMin: 60,  capacity: 14, bookedCount: 14, level: 'Intermediate', description: 'A challenging sequence building heat and core strength.',               room: 'Studio A' },
  { id: 's6',  centerId: 'c1', instructorId: 'i3', title: 'Evening Yin',          type: 'Yin',         date: dayOffset(2), startTime: '19:00', endTime: '20:15', durationMin: 75,  capacity: 14, bookedCount: 5,  level: 'All Levels',   description: 'Wind down your evening with deep, passive stretching.',                 room: 'Studio B' },
  { id: 's7',  centerId: 'c1', instructorId: 'i1', title: 'Weekend Hatha',        type: 'Hatha',       date: dayOffset(4), startTime: '10:00', endTime: '11:00', durationMin: 60,  capacity: 18, bookedCount: 8,  level: 'All Levels',   description: 'A balanced weekend class for body and mind.',                           room: 'Studio A' },

  // --- Flow State Yoga (c2)
  { id: 's8',  centerId: 'c2', instructorId: 'i2', title: 'Ashtanga Primary',     type: 'Ashtanga',    date: dayOffset(0), startTime: '06:00', endTime: '07:30', durationMin: 90,  capacity: 12, bookedCount: 10, level: 'Intermediate', description: 'The traditional Primary Series with led instruction.',                  room: 'Main Hall' },
  { id: 's9',  centerId: 'c2', instructorId: 'i4', title: 'Hot Power Flow',        type: 'Hot Yoga',    date: dayOffset(0), startTime: '17:00', endTime: '18:00', durationMin: 60,  capacity: 16, bookedCount: 15, level: 'Intermediate', description: '37°C heated room, dynamic flow to detoxify and energise.',              room: 'Heated Studio' },
  { id: 's10', centerId: 'c2', instructorId: 'i2', title: 'Power Yoga',            type: 'Power Yoga',  date: dayOffset(1), startTime: '07:00', endTime: '08:00', durationMin: 60,  capacity: 14, bookedCount: 7,  level: 'Advanced',     description: 'Athletic, strength-based yoga for serious practitioners.',              room: 'Main Hall' },
  { id: 's11', centerId: 'c2', instructorId: 'i4', title: 'Bikram 26',             type: 'Hot Yoga',    date: dayOffset(2), startTime: '08:00', endTime: '09:30', durationMin: 90,  capacity: 16, bookedCount: 9,  level: 'All Levels',   description: 'Classic 26-posture Bikram sequence in a 40°C room.',                   room: 'Heated Studio' },
  { id: 's12', centerId: 'c2', instructorId: 'i2', title: 'Ashtanga Self-Practice',type: 'Ashtanga',    date: dayOffset(3), startTime: '06:30', endTime: '08:00', durationMin: 90,  capacity: 10, bookedCount: 4,  level: 'Advanced',     description: 'Mysore-style self-practice with individual guidance.',                  room: 'Main Hall' },

  // --- Tranquil Roots (c3)
  { id: 's13', centerId: 'c3', instructorId: 'i5', title: 'Kundalini Awakening',   type: 'Kundalini',   date: dayOffset(0), startTime: '08:00', endTime: '09:30', durationMin: 90,  capacity: 12, bookedCount: 8,  level: 'All Levels',   description: 'Kriyas, breathwork and mantra to awaken vital energy.',                 room: 'Main Studio' },
  { id: 's14', centerId: 'c3', instructorId: 'i3', title: 'Restorative Deep Heal', type: 'Restorative', date: dayOffset(1), startTime: '10:00', endTime: '11:15', durationMin: 75,  capacity: 10, bookedCount: 6,  level: 'Beginner',     description: 'Bolster-supported postures for complete nervous-system relaxation.',    room: 'Main Studio' },
  { id: 's15', centerId: 'c3', instructorId: 'i5', title: 'Morning Meditation',    type: 'Meditation',  date: dayOffset(2), startTime: '07:00', endTime: '07:45', durationMin: 45,  capacity: 15, bookedCount: 10, level: 'All Levels',   description: 'Guided visualisation and breath-awareness practice.',                   room: 'Garden Room' },
  { id: 's16', centerId: 'c3', instructorId: 'i3', title: 'Yin Yoga Immersion',    type: 'Yin',         date: dayOffset(4), startTime: '14:00', endTime: '15:30', durationMin: 90,  capacity: 12, bookedCount: 3,  level: 'All Levels',   description: 'A longer format Yin session with extended holds and meditation.',       room: 'Main Studio' },

  // --- Urban Zen (c4)
  { id: 's17', centerId: 'c4', instructorId: 'i4', title: 'Inferno Hot Pilates',   type: 'Hot Yoga',    date: dayOffset(0), startTime: '06:00', endTime: '07:00', durationMin: 60,  capacity: 20, bookedCount: 19, level: 'Intermediate', description: 'Inferno-style pilates in a heated room — total body conditioning.',    room: 'Hot Room 1' },
  { id: 's18', centerId: 'c4', instructorId: 'i2', title: 'Advanced Ashtanga',     type: 'Ashtanga',    date: dayOffset(1), startTime: '07:30', endTime: '09:00', durationMin: 90,  capacity: 10, bookedCount: 6,  level: 'Advanced',     description: 'Second Series Ashtanga for experienced practitioners.',                 room: 'Main Hall' },
  { id: 's19', centerId: 'c4', instructorId: 'i4', title: 'Lunchtime Hot Flow',    type: 'Hot Yoga',    date: dayOffset(2), startTime: '12:00', endTime: '13:00', durationMin: 60,  capacity: 20, bookedCount: 12, level: 'All Levels',   description: 'A swift, sweaty flow to power through the afternoon.',                 room: 'Hot Room 2' },

  // --- Mindful Space (c5)
  { id: 's20', centerId: 'c5', instructorId: 'i5', title: 'Gentle Morning Yoga',   type: 'Hatha',       date: dayOffset(0), startTime: '08:00', endTime: '09:00', durationMin: 60,  capacity: 16, bookedCount: 9,  level: 'Beginner',     description: 'A soft, accessible Hatha class perfect for beginners.',                room: 'Studio 1' },
  { id: 's21', centerId: 'c5', instructorId: 'i1', title: 'Lunchtime Vinyasa',     type: 'Vinyasa',     date: dayOffset(1), startTime: '12:15', endTime: '13:00', durationMin: 45,  capacity: 16, bookedCount: 7,  level: 'All Levels',   description: 'A quick energising flow, perfect for a midday break.',                 room: 'Studio 2' },
  { id: 's22', centerId: 'c5', instructorId: 'i5', title: 'Kundalini & Sound Bath', type: 'Kundalini',  date: dayOffset(3), startTime: '18:00', endTime: '19:30', durationMin: 90,  capacity: 12, bookedCount: 11, level: 'All Levels',   description: 'Kundalini sets followed by a 30-minute crystal singing bowl sound bath.',room: 'Studio 1' },
];

// ---------------------------------------------------------------------------
// Subscription Plans
// ---------------------------------------------------------------------------
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_starter',
    name: 'Starter',
    tagline: 'Try yoga at your own pace',
    price: 29,
    interval: 'monthly',
    sessionsPerWeek: 2,
    features: [
      '2 sessions per week',
      'Access to all partner centres',
      'Beginner & All-Levels classes',
      'Mobile app booking',
      'Cancel anytime',
    ],
    colorFrom: 'from-sky-400',
    colorTo: 'to-blue-500',
  },
  {
    id: 'plan_flow',
    name: 'Flow',
    tagline: 'The most popular choice',
    price: 59,
    interval: 'monthly',
    sessionsPerWeek: 5,
    features: [
      '5 sessions per week',
      'Access to all partner centres',
      'All class types & levels',
      'Priority booking (48h advance)',
      'Unlimited meditation sessions',
      'Cancel anytime',
    ],
    colorFrom: 'from-emerald-500',
    colorTo: 'to-teal-600',
    popular: true,
  },
  {
    id: 'plan_unlimited',
    name: 'Unlimited',
    tagline: 'For the dedicated practitioner',
    price: 99,
    interval: 'monthly',
    sessionsPerWeek: 99,
    features: [
      'Unlimited sessions',
      'Access to all partner centres',
      'All class types & levels',
      'Priority booking (72h advance)',
      'Guest pass (1/month)',
      'Exclusive workshops',
      'Personal progress tracking',
    ],
    colorFrom: 'from-violet-500',
    colorTo: 'to-purple-700',
  },
];

// ---------------------------------------------------------------------------
// Demo User
// ---------------------------------------------------------------------------
export const demoUser: User = {
  id: 'u1',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatar: 'https://i.pravatar.cc/150?img=33',
  joinedAt: '2024-01-15',
  subscription: {
    id: 'sub_1',
    userId: 'u1',
    planId: 'plan_flow',
    plan: subscriptionPlans[1],
    status: 'active',
    currentPeriodStart: fmt(new Date(today.getFullYear(), today.getMonth(), 1)),
    currentPeriodEnd: fmt(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
    sessionsUsedThisWeek: 2,
    totalSessionsBooked: 47,
  },
};

// ---------------------------------------------------------------------------
// Demo Bookings
// ---------------------------------------------------------------------------
export const initialBookings: Booking[] = [
  {
    id: 'b1',
    userId: 'u1',
    sessionId: 's1',
    status: 'confirmed',
    bookedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    session: {
      ...sessions[0],
      centerName: 'Lotus Bloom Studio',
      instructorName: 'Maya Patel',
    },
  },
  {
    id: 'b2',
    userId: 'u1',
    sessionId: 's13',
    status: 'confirmed',
    bookedAt: new Date(Date.now() - 86400000).toISOString(),
    session: {
      ...sessions[12],
      centerName: 'Tranquil Roots',
      instructorName: 'Priya Nair',
    },
  },
  {
    id: 'b3',
    userId: 'u1',
    sessionId: 's9',
    status: 'cancelled',
    bookedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    session: {
      ...sessions[8],
      centerName: 'Flow State Yoga',
      instructorName: 'James Okafor',
    },
  },
  {
    id: 'b4',
    userId: 'u1',
    sessionId: 's20',
    status: 'completed',
    bookedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    session: {
      ...sessions[19],
      centerName: 'The Mindful Space',
      instructorName: 'Priya Nair',
    },
  },
];
