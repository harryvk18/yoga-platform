/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Blended palette: French-minimal lightness + warm Indian soul.
        // Light, airy base; terracotta/saffron warmth used sparingly; calm sage.
        sand: '#FAF5EC', // page background — warm, light, never pure white
        stone: '#F0E8D8', // cards, panels, alternating bands
        clay: '#A8482B', // primary accent + CTA (cream text = 5.63:1 AA)
        amber: '#E0922F', // warm highlight / illustration accent — NOT small text
        sage: '#4F6650', // calm green — trust, success, accents (AA on sand)
        ink: '#2A2723', // headings + primary text (warm near-black)
        umber: '#6B5A47', // muted / secondary text
        forest: '#283A30', // deep ground — footer; cream text
        petal: '#CC7E90', // tertiary accent, used very sparingly
        cream: '#FFFDF8', // text on dark + field fill
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Mulish', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cta: '0 8px 22px rgba(168,72,43,0.24)',
        'cta-hover': '0 14px 30px rgba(168,72,43,0.30)',
        card: '0 1px 2px rgba(42,39,35,0.04), 0 10px 30px rgba(42,39,35,0.06)',
        'card-hover': '0 6px 16px rgba(42,39,35,0.08), 0 18px 44px rgba(42,39,35,0.10)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fade: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        breathe: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.012)' },
        },
        draw: { to: { 'stroke-dashoffset': '0' } },
      },
      animation: {
        rise: 'rise 0.7s cubic-bezier(.22,1,.36,1) both',
        fade: 'fade 0.9s ease both',
        breathe: 'breathe 4.5s ease-in-out infinite',
        draw: 'draw 0.9s ease forwards',
      },
    },
  },
  plugins: [],
}
