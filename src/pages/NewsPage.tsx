import { useEffect, useState } from 'react';
import { Newspaper, Loader2, Tag, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { supabase, type NewsItem } from '@/lib/supabase';

export function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (data) setNews(data as NewsItem[]);
        if (error) console.error('News fetch error:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Client <span className="gradient-text">yangliklari</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            UZUM CLIENT ga qo'shilgan barcha yangiliklar va o'zgarishlar.
          </p>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        ) : news.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Newspaper className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Hozircha yangliklar yo'q. Tez orada yangilanishlar bo'ladi!</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/30 via-primary-500/10 to-transparent sm:-translate-x-1/2" />

            <div className="space-y-8">
              {news.map((item, i) => (
                <div
                  key={item.id}
                  className={`relative flex ${i % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 sm:left-1/2 top-6 w-4 h-4 rounded-full bg-primary-500 border-4 border-[#0a0e0a] sm:-translate-x-1/2 z-10 shadow-lg shadow-primary-500/30" />

                  {/* Content */}
                  <div className={`ml-12 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12' : 'sm:pl-12'}`}>
                    <GlassCard reveal delay={i * 80}>
                      {item.version && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs text-primary-300 font-mono mb-3">
                          <Tag className="w-3 h-3" />
                          v{item.version}
                        </div>
                      )}
                      <h3 className="font-display font-semibold text-lg text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.created_at).toLocaleDateString('uz-UZ', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
