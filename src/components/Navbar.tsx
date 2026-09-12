import { useState } from 'react';
import { Menu, X, Home, CreditCard, Headphones, Users, User, Download } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export type Page = 'home' | 'news' | 'subscriptions' | 'support' | 'media' | 'account' | 'admin' | 'auth' | 'download';

type NavbarProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const navItems: { page: Page; label: string; icon: typeof Home }[] = [
    { page: 'home', label: 'Bosh sahifa', icon: Home },
    { page: 'subscriptions', label: 'Obunalar', icon: CreditCard },
    { page: 'media', label: 'Media partnyor', icon: Users },
    { page: 'support', label: 'Qollab-quvatlash', icon: Headphones },
  ];

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-3 border-b border-white/5" style={{ background: 'rgba(5, 8, 16, 0.55)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-3 group flex-shrink-0">
            <img
              src="/logo.png"
              alt="UZUM CLIENT"
              className="w-10 h-10 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-none tracking-tight text-white">
                UZUM <span className="gradient-text">CLIENT</span>
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-3">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  currentPage === item.page
                    ? 'bg-primary-500/15 text-primary-300 border border-primary-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user && profile ? (
              <div className="flex items-center gap-3">
                {profile.is_admin && (
                  <button
                    onClick={() => handleNav('admin')}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      currentPage === 'admin'
                        ? 'bg-warning-500/15 text-warning-300 border border-warning-500/20'
                        : 'text-warning-400 hover:bg-warning-500/10'
                    }`}
                  >
                    Admin
                  </button>
                )}
                {profile.subscription_type !== 'none' && (
                  <button
                    onClick={() => handleNav('download')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      currentPage === 'download'
                        ? 'bg-success-500/15 text-success-300 border border-success-500/20'
                        : 'text-success-400 hover:bg-success-500/10'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Yuklab olish
                  </button>
                )}
                <button
                  onClick={() => handleNav('account')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    currentPage === 'account'
                      ? 'bg-primary-500/15 text-primary-300 border border-primary-500/20'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <User className="w-4 h-4" />
                  {profile.username}
                </button>
              </div>
            ) : (
              <button onClick={() => handleNav('auth')} className="btn-primary text-sm py-2.5 px-6">
                Kirish / Royxatdan otish
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70" />
          <div
            className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] rounded-l-3xl rounded-r-none p-6 pt-24 overflow-y-auto"
            style={{ background: 'rgba(5, 8, 16, 0.85)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                    currentPage === item.page
                      ? 'bg-primary-500/15 text-primary-300 border border-primary-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}

              <div className="h-px bg-white/10 my-3" />

              {user && profile ? (
                <>
                  {profile.is_admin && (
                    <button
                      onClick={() => handleNav('admin')}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                        currentPage === 'admin'
                          ? 'bg-warning-500/15 text-warning-300'
                          : 'text-warning-400 hover:bg-warning-500/10'
                      }`}
                    >
                      Admin panel
                    </button>
                  )}
                  {profile.subscription_type !== 'none' && (
                    <button
                      onClick={() => handleNav('download')}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                        currentPage === 'download'
                          ? 'bg-success-500/15 text-success-300'
                          : 'text-success-400 hover:bg-success-500/10'
                      }`}
                    >
                      <Download className="w-5 h-5" />
                      Yuklab olish
                    </button>
                  )}
                  <button
                    onClick={() => handleNav('account')}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                      currentPage === 'account'
                        ? 'bg-primary-500/15 text-primary-300'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Hisobim ({profile.username})
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      handleNav('home');
                    }}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-error-400 hover:bg-error-500/10 transition-all duration-300 flex items-center gap-3"
                  >
                    <X className="w-5 h-5" />
                    Chiqish
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNav('auth')}
                  className="btn-primary text-sm py-3 px-6 mt-2"
                >
                  Kirish / Royxatdan otish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
