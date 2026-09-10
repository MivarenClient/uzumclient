import { Shield, Home, Newspaper, CreditCard, Headphones, Users } from 'lucide-react';
import type { Page } from './Navbar';

type FooterProps = {
  onNavigate: (page: Page) => void;
};

export function Footer({ onNavigate }: FooterProps) {
  const links: { page: Page; label: string; icon: typeof Home }[] = [
    { page: 'home', label: 'Bosh sahifa', icon: Home },
    { page: 'news', label: 'Yangliklar', icon: Newspaper },
    { page: 'subscriptions', label: 'Obunalar', icon: CreditCard },
    { page: 'media', label: 'Media partnyor', icon: Users },
    { page: 'support', label: 'Qollab-quvatlash', icon: Headphones },
  ];

  return (
    <footer className="relative z-10 mt-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo + description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                UZBEK <span className="gradient-text">CLIENT</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Minecraft uchun eng zo'r cheat mod. Tez, ishonchli va doim yangilanib turuvchi.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white mb-1">Sahifalar</h4>
            {links.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className="text-sm text-gray-400 hover:text-primary-300 transition-colors duration-300 flex items-center gap-2 w-fit"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white mb-1">Aloqa</h4>
            <p className="text-sm text-gray-400">Telegram: @uzumclient</p>
            <p className="text-sm text-gray-400">Email: support@uzumclient.uz</p>
            <p className="text-sm text-gray-400">Ishlash vaqti: 24/7</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            (c) 2026 UZUM CLIENT. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-xs text-gray-500 font-mono">v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
