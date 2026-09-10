import { useState } from 'react';
import { Shield, Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Page } from '@/components/Navbar';

type AuthPageProps = {
  onNavigate: (page: Page) => void;
};

export function AuthPage({ onNavigate }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === 'signup') {
      if (!username.trim()) {
        setError('Iltimos, foydalanuvchi nomini kiriting.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak.');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, username.trim());
      if (error) {
        setError(error);
      } else {
        setSuccess('Hisob yaratildi! Iltimos, elektron pochtangizni tasdiqlang va tizimga kiring.');
        setMode('login');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        onNavigate('account');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 items-center justify-center shadow-lg shadow-primary-500/30 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white">
            {mode === 'login' ? 'Tizimga kirish' : 'Royxatdan o\'tish'}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            UZUM CLIENT hisobingizga kiring yoki yangi hisob yarating
          </p>
        </div>

        {/* Mode toggle */}
        <div className="glass rounded-2xl p-1.5 flex mb-6">
          <button
            onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              mode === 'login'
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Kirish
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              mode === 'signup'
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Royxatdan o'tish
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 sm:p-8 space-y-5">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Foydalanuvchi nomi</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="glass-input w-full pl-12 pr-4 py-3.5 text-sm"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="glass-input w-full pl-12 pr-4 py-3.5 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Parol</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full pl-12 pr-4 py-3.5 text-sm"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-error-500/10 border border-error-500/20 text-sm text-error-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-success-500/10 border border-success-500/20 text-sm text-success-300">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : mode === 'login' ? (
              'Kirish'
            ) : (
              'Royxatdan o\'tish'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Davom etish orqali siz UZUM CLIENT foydalanish shartlariga rozilik bildirasiz.
        </p>
      </div>
    </div>
  );
}
