import { Link } from 'react-router-dom';
import { Leaf, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const SOCIAL = [
  { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { Icon: Twitter,   label: 'Twitter / X', href: 'https://twitter.com' },
  { Icon: Facebook,  label: 'Facebook', href: 'https://facebook.com' },
];

const EXPLORE_LINKS = [
  { label: 'Centers',     to: '/centers' },
  { label: 'Classes',     to: '/centers' },
  { label: 'Instructors', to: '/centers' },
  { label: 'Pricing',     to: '/subscriptions' },
];

// Links that don't have real pages yet — rendered as inert text
const PLACEHOLDER_LINKS = ['About Us', 'Partner With Us', 'Careers', 'Blog'];
const SUPPORT_LINKS = ['Help Centre', 'Privacy Policy', 'Terms of Use'];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">Serenity<span className="text-emerald-400">Hub</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Connecting you with the best yoga studios in your city. Breathe, move, and thrive.
            </p>
            <div className="flex gap-3">
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm">
              {EXPLORE_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company — no real pages yet, rendered as inert text */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              {PLACEHOLDER_LINKS.map(item => (
                <li key={item}>
                  <span className="text-gray-600 cursor-default select-none" title="Coming soon">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              {SUPPORT_LINKS.map(item => (
                <li key={item}>
                  <span className="text-gray-600 cursor-default select-none" title="Coming soon">
                    {item}
                  </span>
                </li>
              ))}
              <li>
                <a
                  href="mailto:hello@serenityhub.com"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  Contact Us
                </a>
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <a
                href="mailto:hello@serenityhub.com"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
              >
                hello@serenityhub.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>&copy; {new Date().getFullYear()} SerenityHub Ltd. All rights reserved.</p>
          <p>Made with care for wellness communities</p>
        </div>
      </div>
    </footer>
  );
}
