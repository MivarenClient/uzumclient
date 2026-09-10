import { useEffect, useState } from 'react';
import { Shield, Zap, Lock, Download, ArrowRight, Cpu, Eye, Bot } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { supabase, type NewsItem } from '@/lib/supabase';
import type { Page } from '@/components/Navbar';

type HomePageProps = {
  onNavigate: (page: Page) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setLatestNews(data as NewsItem[]);
      });
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Tezlik',
      description: 'Optimallashtirilgan kod bilan Maksimal FPS Boost o\'yin tajribasi.',
    },
    {
      icon: Shield,
      title: 'Xavfsizlik',
      description: 'HWID himoyasi va doimiy yangilanishlar bilan ishonchli himoya.',
    },
    {
      icon: Eye,
      title: 'ESP & X-Ray',
      description: 'O\'yinchilarni, chestlarni va resurslarni ko\'rish imkoniyati.',
    },
    {
      icon: Bot,
      title: 'Auto-modullar',
      description: 'KillAura, AutoTotem, Scaffold va boshqa ko\'plab modullar.',
    },
    {
      icon: Cpu,
      title: 'Past CPU',
      description: 'Minimal resurs ishlatish bilan maksimal samaradorlik.',
    },
    {
      icon: Lock,
      title: 'Anti-Cheat',
      description: 'Serverlarning anti-cheat tizimlaridan himoya qiluvchi bypass.',
    },
  ];

  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Title */}
          <h1 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl leading-tight mb-6 animate-fade-in-up">
            <span className="text-white">UZUM</span>{' '}
            <span className="gradient-text">CLIENT</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Minecraft uchun eng zo'r cheat mod. Tez, ishonchli va doim yangilanib turuvchi.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <button
              onClick={() => onNavigate('auth')}
              className="btn-primary flex items-center gap-2 group"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Modni yuklab olish
            </button>
            <button
              onClick={() => onNavigate('subscriptions')}
              className="btn-secondary flex items-center gap-2 group"
            >
              Obuna sotib olish
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
              Nima uchun <span className="gradient-text">UZUM CLIENT?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Eng zo'r xususiyatlar va ishonchli himoya bilan Minecraft o'yiningizni yangi darajaga olib chiqing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <GlassCard key={feature.title} reveal delay={i * 80}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-700/20 border border-primary-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      {latestNews.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-white">
                So'nggi <span className="gradient-text">yangliklar</span>
              </h2>
              <button
                onClick={() => onNavigate('news')}
                className="text-sm text-primary-300 hover:text-primary-200 flex items-center gap-2 group"
              >
                Barchasi
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((item, i) => (
                <GlassCard key={item.id} reveal delay={i * 100}>
                  {item.version && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs text-primary-300 font-mono mb-3">
                      v{item.version}
                    </div>
                  )}
                  <h3 className="font-display font-semibold text-lg text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{item.content}</p>
                  <p className="text-xs text-gray-500 mt-4">
                    {new Date(item.created_at).toLocaleDateString('uz-UZ')}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
