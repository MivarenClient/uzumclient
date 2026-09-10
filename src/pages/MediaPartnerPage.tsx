import { useState, useEffect } from 'react';
import {
  Users, Send, Loader2, AlertCircle,
  CheckCircle, Clock, Award, Megaphone, TrendingUp,
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useAuth } from '@/context/AuthContext';
import { supabase, type MediaApplication } from '@/lib/supabase';
import type { Page } from '@/components/Navbar';

type MediaPartnerPageProps = {
  onNavigate: (page: Page) => void;
};

const benefits = [
  { icon: Award, title: 'Bepul obuna', description: 'Media partnyorlarga bepul umrbodlik obuna beriladi' },
  { icon: Megaphone, title: 'Reklama', description: 'Katta media partnyor bo\'lsangiz videolaringiz kanalda reklama qilinadi' },
  { icon: TrendingUp, title: 'O\'sish', description: 'UZUM CLIENT orqali pul ishlang' },
];

export function MediaPartnerPage({ onNavigate }: MediaPartnerPageProps) {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState<MediaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    channel_name: '',
    channel_url: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from('media_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (data) setApplications(data as MediaApplication[]);
          if (error) console.error('Media apps fetch error:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onNavigate('auth');
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const { data, error } = await supabase
        .from('media_applications')
        .insert({
          user_id: user.id,
          channel_name: form.channel_name,
          channel_url: form.channel_url,
          subscriber_count: 0,
          avg_views: 0,
          description: form.description,
        })
        .select()
        .single();

      if (error) throw error;

      setApplications([data as MediaApplication, ...applications]);
      setForm({ channel_name: '', channel_url: '', description: '' });
      setMessage({ type: 'success', text: 'So\'rovingiz yuborildi! Adminlar 24 soat ichida tekshirib beradi.' });
    } catch (err) {
      console.error('Submit error:', err);
      setMessage({ type: 'error', text: 'So\'rov yuborishda xatolik yuz berdi.' });
    }
    setSubmitting(false);
  };

  const statusConfig = {
    pending: { label: 'Kutilmoqda', color: 'warning', icon: Clock },
    approved: { label: 'Tasdiqlangan', color: 'success', icon: CheckCircle },
    rejected: { label: 'Rad etilgan', color: 'error', icon: AlertCircle },
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Media <span className="gradient-text">partnyor</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            UZUM CLIENT ni reklama qiling va bepul obuna oling. Adminlar 24 soat ichida so'rovingizni tekshirib beradi.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {benefits.map((benefit, i) => (
            <GlassCard key={benefit.title} reveal delay={i * 80} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-3">
                <benefit.icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-400">{benefit.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* Existing applications */}
        {user && applications.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display font-bold text-2xl text-white mb-6">So'rovlarim</h2>
            <div className="space-y-4">
              {applications.map((app) => {
                const status = statusConfig[app.status];
                const StatusIcon = status.icon;
                return (
                  <div key={app.id} className="glass-card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{app.channel_name}</h3>
                        <a href={app.channel_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-300 hover:text-primary-200">
                          {app.channel_url}
                        </a>
                        <p className="text-sm text-gray-400 mt-2">{app.description}</p>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                        status.color === 'warning' ? 'bg-warning-500/10 border border-warning-500/20 text-warning-300' :
                        status.color === 'success' ? 'bg-success-500/10 border border-success-500/20 text-success-300' :
                        'bg-error-500/10 border border-error-500/20 text-error-300'
                      }`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Application form */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8">
          <h2 className="font-display font-bold text-2xl text-white mb-2">Zayafka yuborish</h2>
          <p className="text-sm text-gray-400 mb-6">
            Quyidagi formani to'ldiring. Adminlar 24 soat ichida tekshirib beradi.
          </p>

          {!user ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Zayafka yuborish uchun avval tizimga kiring.</p>
              <button onClick={() => onNavigate('auth')} className="btn-primary">
                Kirish / Royxatdan o'tish
              </button>
            </div>
          ) : profile?.is_blocked ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-error-500/10 border border-error-500/20 text-sm text-error-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              Hisobingiz bloklangan. Iltimos, qollab-quvatlash bilan bog'laning.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Kanal nomi</label>
                  <input
                    type="text"
                    value={form.channel_name}
                    onChange={(e) => setForm({ ...form, channel_name: e.target.value })}
                    placeholder="Mening kanalim"
                    className="glass-input w-full px-4 py-3.5 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Kanal havolasi</label>
                  <input
                    type="url"
                    value={form.channel_url}
                    onChange={(e) => setForm({ ...form, channel_url: e.target.value })}
                    placeholder="https://youtube.com/@..."
                    className="glass-input w-full px-4 py-3.5 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tavsif</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Kanal haqida qisqacha ma'lumot..."
                  rows={4}
                  className="glass-input w-full px-4 py-3.5 text-sm resize-none"
                  required
                />
              </div>

              {message && (
                <div className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
                  message.type === 'error'
                    ? 'bg-error-500/10 border border-error-500/20 text-error-300'
                    : 'bg-success-500/10 border border-success-500/20 text-success-300'
                }`}>
                  {message.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                  <span>{message.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Zayafka yuborish</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
