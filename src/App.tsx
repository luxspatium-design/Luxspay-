/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ShopView } from './components/views/ShopView';
import { FavoritesView } from './components/views/FavoritesView';
import { LeaderboardView } from './components/views/LeaderboardView';
import { RewardsView } from './components/views/RewardsView';
import { ProfileView } from './components/views/ProfileView';
import { GameDetailView } from './components/views/GameDetailView';
import { CountryCurrencyModal } from './components/CountryCurrencyModal';
import { NotificationsModal } from './components/NotificationsModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import { SettingsModal } from './components/views/SettingsModal';
import { HelpContactModal } from './components/views/HelpContactModal';
import { ShareModal } from './components/views/ShareModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { ToastNotificationBanner } from './components/ToastNotificationBanner';
import { SplashScreenModal } from './components/SplashScreenModal';

const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedGame,
    setSelectedGame,
    setSearchQuery,
    setActiveTab,
    isSplashModalOpen,
    setIsSplashModalOpen,
  } = useApp();

  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);

  const handleVoiceSearchSelect = (query: string) => {
    setSearchQuery(query);
    setActiveTab('boutique');
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {selectedGame ? (
          <GameDetailView game={selectedGame} onBack={() => setSelectedGame(null)} />
        ) : (
          <>
            {activeTab === 'boutique' && <ShopView />}
            {activeTab === 'favoris' && <FavoritesView />}
            {activeTab === 'classement' && <LeaderboardView />}
            {activeTab === 'recompenses' && <RewardsView />}
            {activeTab === 'profil' && <ProfileView />}
          </>
        )}
      </main>

      {/* Real-time Push Notifications / Toasts */}
      <ToastNotificationBanner />

      {/* Floating Circular WhatsApp Service Client Button */}
      <FloatingWhatsApp />

      {/* Bottom Navigation for Mobile & Responsive */}
      <BottomNav />

      {/* Global Modals */}
      <CountryCurrencyModal />
      <NotificationsModal />
      <OrderDetailModal />
      <SettingsModal />
      <HelpContactModal />
      <ShareModal />
      <AdminPanelModal />
      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSelectSearch={handleVoiceSearchSelect}
      />
      <SplashScreenModal
        isOpen={isSplashModalOpen}
        onClose={() => setIsSplashModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
