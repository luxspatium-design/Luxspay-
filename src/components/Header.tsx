import React, { useState } from 'react';
import { Bell, Mic, Moon, Search, Settings, ShieldCheck, Sun, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LuxsLogo } from './LuxsLogo';

interface HeaderProps {
  onOpenVoiceSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenVoiceSearch }) => {
  const {
    selectedCountry,
    currency,
    setIsCountryModalOpen,
    unreadNotificationsCount,
    setIsNotificationsModalOpen,
    searchQuery,
    setSearchQuery,
    addSearchHistory,
    setActiveTab,
    setIsAdminPanelOpen,
    setSelectedGame,
    theme,
    toggleTheme,
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearchHistory(searchQuery.trim());
      setActiveTab('boutique');
      setSelectedGame(null);
    }
  };

  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      {/* Top bar zone */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <button
          onClick={() => {
            setActiveTab('boutique');
            setSelectedGame(null);
          }}
          className="flex items-center text-left hover:opacity-95 transition-opacity"
        >
          <LuxsLogo size="md" />
        </button>

        {/* Center / Search Bar on Tablet & Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher Free Fire, COD, PUBG..."
              className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-800/80 dark:focus:bg-slate-750 dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm pl-10 pr-20 py-2 rounded-xl border border-transparent focus:border-amber-400 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-9 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenVoiceSearch}
              title="Recherche vocale"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-400/10 transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Actions: Theme Toggle + Country/Currency + Notifications + Admin */}
        <div className="flex items-center gap-2">
          {/* Quick Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            aria-label="Changer le thème"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Country & Currency Pill Button */}
          <button
            onClick={() => setIsCountryModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all active:scale-95"
            title="Changer de pays ou devise"
          >
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span className="font-bold text-slate-900 dark:text-white">{currency}</span>
            <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-normal">| {selectedCountry.code}</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationsModalOpen(true)}
            className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 ring-2 ring-white dark:ring-slate-900 rounded-full animate-pulse" />
            )}
          </button>

          {/* Admin Panel Toggle */}
          <button
            onClick={() => setIsAdminPanelOpen(true)}
            className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Paramètres de démonstration & Admin"
            aria-label="Admin"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Row */}
      <div className="md:hidden px-4 pb-2.5">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Rechercher un jeu, pack ou service..."
            className="w-full bg-slate-100 focus:bg-white dark:bg-slate-800 dark:focus:bg-slate-750 dark:focus:bg-slate-800 text-slate-900 dark:text-white text-sm pl-9 pr-18 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 focus:border-amber-400 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-9 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onOpenVoiceSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            title="Recherche vocale"
          >
            <Mic className="w-4 h-4" />
          </button>
        </form>
      </div>
    </header>
  );
};
