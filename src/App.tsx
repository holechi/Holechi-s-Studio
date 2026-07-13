import React from 'react';
import { BlogProvider, useBlog } from './context/BlogContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HomeView } from './components/HomeView';
import { StoryView } from './components/StoryView';
import { PhotoView } from './components/PhotoView';
import { TravelView } from './components/TravelView';
import { FriendView } from './components/FriendView';
import { LibraryView } from './components/LibraryView';
import { GuestbookView } from './components/GuestbookView';
import { IntroView } from './components/IntroView';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab } = useBlog();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'story':
        return <StoryView />;
      case 'photo':
        return <PhotoView />;
      case 'travel':
        return <TravelView />;
      case 'friend':
        return <FriendView />;
      case 'library':
        return <LibraryView />;
      case 'guestbook':
        return <GuestbookView />;
      case 'intro':
        return <IntroView />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F4] dark:bg-[#1A1614] transition-colors duration-300">
      
      {/* Universal Top Header */}
      <Header />

      {/* Main Core Body Container */}
      <main className="flex-1 w-full pt-20">
        {/* Render Hero Section only on Home view */}
        {activeTab === 'home' && <Hero />}

        {/* Dynamic Inner Tab Stage with Fade-In animation effects */}
        <div className="animate-fade-in transition-all">
          {renderActiveView()}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BlogProvider>
      <AppContent />
    </BlogProvider>
  );
}
