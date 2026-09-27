/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { ActiveTab, AppProvider, useApp } from './context/AppContext';
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

const TAB_INDEX: Record<ActiveTab, number> = {
  boutique: 0,
  favoris: 1,
  classement: 2,
  recompenses: 3,
  profil: 4,
};

const tabVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 28 : direction < 0 ? -28 : 0,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -28 : direction < 0 ? 28 : 0,
    opacity: 0,
  }),
};

const tabTransition: Transition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
};

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

  // Direction-aware tab transition tracking
  const [{ currentTab, direction }, setTabState] = useState({
    currentTab: activeTab,
    direction: 0,
  });

  if (activeTab !== currentTab) {
    const prevIdx = TAB_INDEX[currentTab] ?? 0;
    const currIdx = TAB_INDEX[activeTab] ?? 0;
    setTabState({
      currentTab: activeTab,
      direction: currIdx >= prevIdx ? 1 : -1,
    });
  }

  const handleVoiceSearchSelect = (query: string) => {
    setSearchQuery(query);
    setActiveTab('boutique');
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)} />

      {/* Main Content Area with Framer Motion Page Transitions */}
      <main className="flex-1 w-full overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {selectedGame ? (
            <motion.div
              key={`game-${selectedGame.id}`}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] as const }}
              className="w-full"
            >
              <GameDetailView game={selectedGame} onBack={() => setSelectedGame(null)} />
            </motion.div>
          ) : (
            <motion.div
              key={currentTab}
              custom={direction}
              variants={tabVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={tabTransition}
              className="w-full"
            >
              {currentTab === 'boutique' && <ShopView />}
              {currentTab === 'favoris' && <FavoritesView />}
              {currentTab === 'classement' && <LeaderboardView />}
              {currentTab === 'recompenses' && <RewardsView />}
              {currentTab === 'profil' && <ProfileView />}
            </motion.div>
          )}
        </AnimatePresence>
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
