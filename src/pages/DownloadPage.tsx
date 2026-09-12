import { Download, Loader2, Shield, CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Page } from '@/components/Navbar';

type DownloadPageProps = {
  onNavigate: (page: Page) => void;
};

export function DownloadPage({ onNavigate }: DownloadPageProps) {
  const { user, profile } = useAuth();

  if (!user || !profile) {
    onNavigate('auth');
    return null;
  }

  if (profile.subscription_type === 'none') {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-error-500/10 border border-error-500/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-error-400" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">Obuna talab qilinadi</h2>
          <p className="text-gray-400 mb-6">Clientni yuklab olish uchun obuna sotib olishingiz kerak.</p>
          <button onClick={() => onNavigate('subscriptions')} className="btn-primary px-8">
            Obuna sotib olish
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const email = user.email || profile.username;
      const fileName = `UzumClient-${email}.jar`;

      const response = await fetch(`${import.meta.env.BASE_URL}client.jar`);
      if (!response.ok) throw new Error('Client fayli topilmadi');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Yuklab olishda xatolik yuz berdi.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display font-bold text-3xl text-white mb-2">Clientni yuklab oling</h2>
          <p className="text-gray-400">Obunangiz faol — clientni hoziroq yuklab oling!</p>
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-primary-400" />
            <div>
              <p className="text-sm text-gray-400">Yuklab olinayotgan akkaunt:</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-success-400" />
            <div>
              <p className="text-sm text-gray-400">Obuna turi:</p>
              <p className="text-white font-medium">{profile.subscription_type === 'lifetime' ? 'Umrbodlik' : profile.subscription_type === '90day' ? '90 kunlik' : '30 kunlik'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg font-semibold"
        >
          <Download className="w-5 h-5" />
          Yuklab olish
        </button>

        <div className="mt-6 glass-card p-4">
          <h4 className="text-sm font-semibold text-white mb-2">O'rnatish:</h4>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
            <li>Faylni .minecraft/mods papkasiga joylashtiring</li>
            <li>Fayl nomi: <span className="text-primary-400 font-mono">UzumClient-{user.email}.jar</span></li>
            <li>Minecraft Java Edition (Fabric 1.21.4) ni ishga tushiring</li>
            <li>HWID avtomatik bog'lanadi — qo'shimcha hech narsa kerak emas</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
