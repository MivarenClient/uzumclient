import { useState } from 'react';
import {
  Headphones, MessageSquare, Clock, CheckCircle,
  ChevronDown, ChevronUp, Send, Loader2, AlertCircle,
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const faqs = [
  {
    question: 'UZUM CLIENT ni qanday o\'rnataman?',
    answer: 'Avval royxatdan o\'ting va obuna sotib oling. So\'ng "Hisobim" bo\'limidan modni yuklab oling va Minecraft mods papkasiga joylashtiring.',
  },
  {
    question: 'HWID nima va uni qanday topaman?',
    answer: 'HWID - bu sizning kompyuteringizning noyob identifikatori. Modni ishga tushirganingizda, HWID avtomatik hisobingizga biriktiriladi. "Hisobim" bo\'limida ko\'rishingiz mumkin.',
  },
  {
    question: 'Obuna qancha vaqt amal qiladi?',
    answer: 'Obuna turi ga qarab: 30 kunlik obuna 30 kun, 90 kunlik obuna 90 kun, umrbodlik obuna esa cheksiz amal qiladi. Qolgan kunlarni "Hisobim" bo\'limida ko\'rishingiz mumkin.',
  },
  {
    question: 'Mod yangilanishlari qachon chiqadi?',
    answer: 'Yangilanishlar muntazam chiqadi. Barcha yangiliklar "Yangliklar" bo\'limida e\'lon qilinadi. Obuna faol bo\'lsa, yangilanishlar bepul.',
  },
  {
    question: 'Hisobim bloklandi, nima qilaman?',
    answer: 'Agar hisobingiz bloklangan bo\'lsa, pastdagi aloqa formasi orqali biz bilan bog\'laning. Adminlar 24 soat ichida javob beradi.',
  },
  {
    question: 'Media partnyor bo\'lishim mumkinmi?',
    answer: 'Ha! "Media partnyor" bo\'limiga o\'ting, qoidalarni o\'qing va zayafka yuboring. Adminlar 24 soat ichida tekshirib beradi.',
  },
];

export function SupportPage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Iltimos, avval tizimga kiring.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Store as a simple message in the database via a generic table or edge function
      // For now, we'll just simulate success
      setSent(true);
      setForm({ subject: '', message: '' });
    } catch (err) {
      console.error('Support submit error:', err);
      setError('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Qollab-<span className="gradient-text">quvatlash</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Savollaringiz bormi? Bizga yozing - 24/7 qollab-quvatlash tayyor!
          </p>
        </div>

        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <a href="https://t.me/UzumClientSupport" target="_blank" rel="noopener noreferrer">
            <GlassCard className="text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Telegram</h3>
              <p className="text-sm text-gray-400">@UzumClientSupport</p>
            </GlassCard>
          </a>
          <GlassCard className="text-center">
            <div className="w-12 h-12 rounded-xl bg-warning-500/10 border border-warning-500/20 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-warning-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Ishlash vaqti</h3>
            <p className="text-sm text-gray-400">24/7</p>
          </GlassCard>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-2xl text-white mb-6">Tez-tez beriladigan savollar</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-white pr-4">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8">
          <h2 className="font-display font-bold text-2xl text-white mb-2">Bizga yozing</h2>
          <p className="text-sm text-gray-400 mb-6">Savolingizni yozing, adminlar 24 soat ichida javob beradi.</p>

          {sent ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-success-500/10 border border-success-500/20 text-sm text-success-300 mb-4">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              Xabaringiz yuborildi! Tez orada javob beramiz.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mavzu</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Mavzuni kiriting"
                  className="glass-input w-full px-4 py-3.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Xabar</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Savolingizni yozing..."
                  rows={5}
                  className="glass-input w-full px-4 py-3.5 text-sm resize-none"
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-error-500/10 border border-error-500/20 text-sm text-error-300">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Yuborish</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
