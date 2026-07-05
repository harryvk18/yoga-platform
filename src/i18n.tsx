import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Lang = 'fr' | 'en';

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LanguageContext = createContext<Ctx>({ lang: 'fr', setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem('lang');
      if (s === 'fr' || s === 'en') return s;
    } catch {
      /* ignore */
    }
    return 'fr';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

export function useT(): Content {
  return CONTENT[useLang().lang];
}

// French is the source of truth; its shape defines the Content type, which the
// English copy below must satisfy exactly (keeps the two languages in parity).
const fr = {
  nav: { join: 'Rejoindre' },
  counter: {
    beFirst: 'Soyez parmi les premiers en France',
    joined: 'Déjà {n} inscrit·e·s, ville par ville',
  },
  hero: {
    eyebrow: 'Bientôt dans votre ville · partout en France',
    headline: 'Votre premier cours de yoga est offert.',
    headlineAccent: 'Sur place, sans carte bancaire.',
    subhead: 'Du vrai yoga en studio près de chez vous — 0 € pour essayer, sans engagement.',
    formIntro:
      'Inscrivez-vous à la liste d’attente : nous vous invitons à une première séance gratuite dès l’ouverture dans votre ville.',
    chips: ['Premier cours offert', 'Sans carte bancaire', 'Sans engagement'],
  },
  valueStrip: [
    { label: 'Gratuit à l’essai', text: 'Un vrai cours en studio — sans carte, sans paiement d’avance.' },
    { label: 'Vraiment accessible', text: 'Des forfaits clairs — séances en ligne dès 7,50 € · cours à l’unité dès 15 €. Sans frais cachés.' },
    { label: 'Sans engagement', text: 'Annulez quand vous voulez · mettez en pause à tout moment.' },
  ],
  how: {
    eyebrow: 'Commencez en douceur',
    title: 'Comment ça marche',
    intro: 'Vous ne payez pas un centime pour découvrir si le yoga est fait pour vous.',
    steps: [
      { title: 'Rejoignez la liste d’attente', body: 'Votre nom, votre numéro et votre e-mail — c’est tout. Aucun paiement pour s’inscrire.' },
      { title: 'Recevez votre invitation', body: 'Dès l’ouverture dans votre ville, nous vous envoyons une invitation pour une séance d’essai gratuite.' },
      { title: 'Déroulez votre tapis', body: 'Poussez la porte d’un studio près de chez vous et profitez de votre premier cours, offert — doux et accessible aux débutants.' },
      { title: 'Continuez seulement si vous aimez', body: 'Choisissez un forfait adapté à votre budget — ou pas. Aucun frais, aucune pression.' },
    ],
  },
  why: {
    eyebrow: 'Le yoga, comme il devrait être',
    title: 'De vrais profs. De vrais tapis. De vraies personnes.',
    intro:
      'Ni une salle de sport avec un coin yoga, ni une appli qui vous laisse seul face à un écran — une salle chaleureuse où chacun prend soin des autres. Sans jargon, sans jugement. Commencez exactement là où vous en êtes.',
    features: [
      { icon: 'euro', title: 'Accessible et abordable', body: 'Forfaits clairs, séances en ligne dès 7,50 € ; cours à l’unité dès 15 €. Pour que chacun trouve sa place sur le tapis.' },
      { icon: 'mukta', title: 'Liberté totale', body: 'Annulez quand vous voulez, mettez en pause à tout moment — sans contrat, sans frais de résiliation, sans appel gênant.' },
      { icon: 'lotus', title: 'Une séance d’essai offerte', body: 'Un vrai cours avec un vrai professeur près de chez vous — sans carte, sans paiement pour essayer.' },
    ],
    flexTitle: 'Annulez quand vous voulez. Mettez en pause à tout moment. Vraiment.',
    flexPoints: [
      'Aucun contrat à long terme, jamais',
      'Mettez en pause quand la vie s’emballe — voyages, vacances, travail',
      'Annulez en deux clics — sans frais, sans petites lignes',
    ],
  },
  pricing: {
    eyebrow: 'Tarifs simples et transparents',
    title: 'Le yoga pour tous, pas pour quelques-uns',
    intro:
      'Votre première séance en studio est offerte, sans carte. Et nos séances en ligne sont données en direct par des professeurs en Inde — à 7,50 € la séance.',
    plans: [
      { code: 'En studio', name: 'En présentiel', price: '79,99 €', cadence: '/mois', blurb: '8 cours en studio par mois, dans un studio partenaire près de chez vous.', popular: true, note: '8 séances · moins de 10 € la séance' },
      { code: 'En ligne', name: 'En direct d’Inde', price: '60 €', cadence: '/mois', blurb: '8 séances en ligne par mois, en direct avec un professeur en Inde — depuis chez vous.', popular: false, note: '8 séances · 7,50 € la séance' },
    ],
    noCard: 'Aucune carte bancaire pour rejoindre la liste ou essayer votre premier cours.',
    founding: {
      eyebrow: 'Membres fondateurs',
      title: 'Inscrivez-vous maintenant, gardez votre tarif à vie',
      perks: [
        'Tarif fondateur bloqué à vie — à l’abri des hausses',
        'Accès prioritaire aux séances d’essai, avant l’ouverture publique',
        'Parrainez 3 amis → votre mois suivant est offert',
      ],
      cityLine: 'Nous ouvrons ville par ville — vous inscrire fait venir le studio plus vite chez vous.',
    },
  },
  faq: {
    eyebrow: 'Vos questions, nos réponses',
    title: 'Tout ce que vous vous demandez peut-être',
    items: [
      { q: 'La première séance est-elle vraiment gratuite ?', a: 'Oui, entièrement. Aucun paiement, aucune carte bancaire, aucune condition. Nous voulons simplement que vous ressentiez un cours avant de décider quoi que ce soit.' },
      { q: 'Je n’ai jamais fait de yoga. Est-ce pour moi ?', a: 'Absolument. La plupart de notre communauté a commencé débutante. Les professeurs proposent une variante plus simple pour chaque posture — aucune souplesse ni condition physique requise.' },
      { q: 'Les séances en ligne, comment ça marche ?', a: 'Avec le forfait En ligne (60 €/mois), vous pratiquez en direct depuis chez vous avec un professeur en Inde — 8 séances par mois, pour une pratique authentique.' },
      { q: 'Puis-je vraiment annuler ou mettre en pause quand je veux ?', a: 'Oui — c’est une promesse essentielle. Mettez en pause quand vous êtes occupé, annulez quand vous voulez, en deux clics. Sans engagement, sans préavis, sans frais.' },
      { q: 'Quand ouvrez-vous dans ma ville ?', a: 'Nous ouvrons ville par ville. Inscrivez-vous avec votre numéro et nous vous préviendrons dès l’ouverture près de chez vous, avec votre invitation gratuite.' },
      { q: 'Allez-vous m’envoyer du spam ?', a: 'Jamais. Nous vous contactons uniquement au sujet de votre séance gratuite et de l’ouverture dans votre ville. Désinscription à tout moment.' },
    ],
  },
  finalForm: {
    title: 'Commencez votre pratique',
    intro:
      'Réservez votre première séance gratuite — 20 secondes suffisent. Nous vous inviterons dès l’ouverture dans votre ville.',
  },
  footer: {
    mission: 'Le yoga pour tous — tous les corps, tous les budgets.',
    tagline: 'Du yoga chaleureux, accessible et qui vous ressemble — partout en France.',
    originLine: 'Né en Inde, pratiqué en France · Namasté',
  },
  form: {
    ctaLabel: 'Réserver ma séance gratuite',
    ctaShort: 'Cours offert · 0 €, sans carte',
    namePh: 'Votre nom',
    phonePh: 'Numéro de mobile',
    emailPh: 'Adresse e-mail',
    cityPh: 'Votre ville (facultatif)',
    cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Nantes', 'Nice', 'Strasbourg', 'Montpellier', 'Autre'],
    consent: 'J’accepte d’être recontacté(e) au sujet de ma séance d’essai gratuite. Pas de spam.',
    privacyNote:
      'Nous utilisons vos informations uniquement pour vous inviter à votre séance gratuite. Un seul message pour confirmer — jamais de démarchage, jamais de spam.',
    submitting: 'Enregistrement…',
    successTitle: 'Vous êtes inscrit(e) !',
    successBody:
      'Nous vous écrirons dès l’ouverture près de chez vous, avec votre invitation pour une séance gratuite. Bienvenue — ravis de vous compter parmi nous.',
    errors: {
      name: 'Indiquez votre nom, s’il vous plaît.',
      phone: 'Entrez un numéro de mobile valide (10 chiffres).',
      email: 'Entrez une adresse e-mail valide.',
      consent: 'Merci de cocher la case pour continuer.',
      generic: 'Un problème est survenu de notre côté. Réessayez dans un instant.',
      notConnected: 'La liste d’attente n’est pas encore connectée. Réessayez bientôt.',
    },
  },
};

export type Content = typeof fr;

const en: Content = {
  nav: { join: 'Join' },
  counter: {
    beFirst: 'Be among the first in France',
    joined: 'Already {n} signed up, city by city',
  },
  hero: {
    eyebrow: 'Coming soon to your city · across France',
    headline: 'Your first yoga class is free.',
    headlineAccent: 'In person, no card needed.',
    subhead: 'Real studio yoga near you — €0 to try, cancel anytime.',
    formIntro:
      'Join the waitlist and we’ll invite you to a free first class the moment we open in your city.',
    chips: ['First class free', 'No card needed', 'Cancel anytime'],
  },
  valueStrip: [
    { label: 'Free to try', text: 'A real studio class — no card, no payment up front.' },
    { label: 'Genuinely accessible', text: 'Clear plans — online sessions from €7.50 · drop-in from €15. No hidden fees.' },
    { label: 'No commitment', text: 'Cancel anytime · pause anytime · no contracts, ever.' },
  ],
  how: {
    eyebrow: 'Start gently',
    title: 'How it works',
    intro: 'You don’t pay a single euro to find out if yoga is for you.',
    steps: [
      { title: 'Join the waitlist', body: 'Your name, number and email — that’s all. No payment to sign up, ever.' },
      { title: 'Get your invite', body: 'When we open in your city, we’ll send you an invitation for a free trial class.' },
      { title: 'Roll out your mat', body: 'Walk into a studio near you and enjoy your first class, on us — gentle and beginner-friendly.' },
      { title: 'Continue only if you love it', body: 'Pick a plan that fits your budget — or don’t. No charges, no pressure.' },
    ],
  },
  why: {
    eyebrow: 'Yoga, the way it’s meant to be',
    title: 'Real teachers. Real mats. Real people.',
    intro:
      'Not a gym with a yoga corner, not an app that leaves you alone with a screen — a warm room of people who show up for each other. No jargon, no judgement. Start exactly where your body is.',
    features: [
      { icon: 'euro', title: 'Accessible & affordable', body: 'Clear plans, online sessions from €7.50; drop-in from €15. So everyone finds their place on the mat.' },
      { icon: 'mukta', title: 'Total freedom', body: 'Cancel anytime, pause anytime — no contracts, no cancellation fees, no awkward phone calls.' },
      { icon: 'lotus', title: 'A free trial class', body: 'A real class with a real teacher near you — no card, no payment to find out if it’s for you.' },
    ],
    flexTitle: 'Cancel anytime. Pause anytime. Truly.',
    flexPoints: [
      'No long-term contracts, ever',
      'Pause when life gets busy — travel, holidays, work',
      'Cancel in two clicks — no fees, no fine print',
    ],
  },
  pricing: {
    eyebrow: 'Simple, honest pricing',
    title: 'Yoga for everyone, not the few',
    intro:
      'Your first studio class is free, no card. And our online sessions are taught live by teachers in India — at €7.50 a session.',
    plans: [
      { code: 'In studio', name: 'In person', price: '€79.99', cadence: '/month', blurb: '8 in-person studio classes a month, at a partner studio near you.', popular: true, note: '8 classes · under €10 each' },
      { code: 'Online', name: 'Live from India', price: '€60', cadence: '/month', blurb: '8 live online sessions a month with a teacher in India — from home.', popular: false, note: '8 sessions · €7.50 each' },
    ],
    noCard: 'No card needed to join the waitlist or try your first class.',
    founding: {
      eyebrow: 'Founding members',
      title: 'Join now, keep your price for life',
      perks: [
        'Founding price locked for life — safe from future increases',
        'Priority access to free trial classes, before public launch',
        'Refer 3 friends → your next month is free',
      ],
      cityLine: 'We open city by city — joining now brings the studio to your city faster.',
    },
  },
  faq: {
    eyebrow: 'Questions, answered',
    title: 'Everything you might be wondering',
    items: [
      { q: 'Is the first class really free?', a: 'Yes, completely. No payment, no card details, no strings. We just want you to feel a class before deciding anything.' },
      { q: 'I’ve never done yoga. Is this for me?', a: 'Absolutely. Most of our community started as complete beginners. Teachers offer an easier option for every pose — no flexibility or fitness needed to start.' },
      { q: 'How do the online sessions work?', a: 'With the Online plan (€60/month) you practise live from home with a teacher in India — 8 sessions a month, for a truly authentic practice.' },
      { q: 'Can I really cancel or pause anytime?', a: 'Yes — it’s a core promise. Pause when you’re busy, cancel whenever you like, in two clicks. No commitment, no notice period, no fees.' },
      { q: 'When are you launching in my city?', a: 'We open city by city. Join with your number and we’ll let you know the moment we open near you, with your free invitation.' },
      { q: 'Will you spam me?', a: 'Never. We only contact you about your free class and your city opening. Unsubscribe anytime.' },
    ],
  },
  finalForm: {
    title: 'Begin your practice',
    intro:
      'Reserve your free first class — it takes 20 seconds. We’ll invite you the moment we open in your city.',
  },
  footer: {
    mission: 'Yoga for everyone — every body, every budget.',
    tagline: 'Warm, affordable yoga that feels like yours — across France.',
    originLine: 'Born in India, practised in France · Namasté',
  },
  form: {
    ctaLabel: 'Claim my free class',
    ctaShort: 'Free class · €0, no card',
    namePh: 'Your name',
    phonePh: 'Mobile number',
    emailPh: 'Email address',
    cityPh: 'Your city (optional)',
    cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Nantes', 'Nice', 'Strasbourg', 'Montpellier', 'Other'],
    consent: 'I agree to be contacted about my free trial class. No spam.',
    privacyNote:
      'We use your details only to invite you to your free class. One message to confirm — never a sales pitch, never spam.',
    submitting: 'Saving…',
    successTitle: 'You’re on the list!',
    successBody:
      'We’ll write to you the moment we open near you, with your invitation for a free class. Welcome — we’re glad to have you.',
    errors: {
      name: 'Please tell us your name.',
      phone: 'Enter a valid 10-digit mobile number.',
      email: 'Enter a valid email address.',
      consent: 'Please tick the box to continue.',
      generic: 'Something went wrong on our end. Please try again in a moment.',
      notConnected: 'The waitlist isn’t connected yet. Please try again shortly.',
    },
  },
};

export const CONTENT: Record<Lang, Content> = { fr, en };
