import { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Background } from '@/components/Background';
import { Navbar, type Page } from '@/components/Navbar';
import { HomePage } from '@/pages/HomePage';
import { AuthPage } from '@/pages/AuthPage';
import { AccountPage } from '@/pages/AccountPage';
import { SubscriptionsPage } from '@/pages/SubscriptionsPage';
import { NewsPage } from '@/pages/NewsPage';
import { MediaPartnerPage } from '@/pages/MediaPartnerPage';
import { SupportPage } from '@/pages/SupportPage';
import { AdminPage } from '@/pages/AdminPage';

function AppContent() {
  const [page, setPage] = useState<Page>('home');

  const handleNavigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage onNavigate={handleNavigate} />;
      case 'auth': return <AuthPage onNavigate={handleNavigate} />;
      case 'account': return <AccountPage onNavigate={handleNavigate} />;
      case 'subscriptions': return <SubscriptionsPage onNavigate={handleNavigate} />;
      case 'news': return <NewsPage />;
      case 'media': return <MediaPartnerPage onNavigate={handleNavigate} />;
      case 'support': return <SupportPage />;
        case 'admin': return <AdminPage onNavigate={handleNavigate} />;
      default: return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Background />
      <Navbar currentPage={page} onNavigate={handleNavigate} />
      <main className="relative z-10">
        {renderPage()}
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
