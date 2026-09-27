import React from 'react';
import { Gift, Heart, ShoppingBag, Trophy, User } from 'lucide-react';
import { ActiveTab, useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedGame, favorites, user } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'boutique', label: 'Boutique', icon: ShoppingBag },
    { id: 'favoris', label: 'Favoris', icon: Heart },
    { id: 'classement', label: 'Classement', icon: Trophy },
    { id: 'recompenses', label: 'Récompenses', icon: Gift },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setSelectedGame(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop / Tablet Sub-Header Navigation Tabs */}
      <nav className="hidden md:flex justify-center border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-[61px] z-20 transition-colors duration-200">
        <div className="flex items-center gap-1 py-1 px-4 max-w-4xl mx-auto w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'favoris' && favorites.length > 0 && (
                  <span className="text-[11px] font-bold px-1.5 py-0.2 bg-white/80 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full">
                    {favorites.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Fixed Bottom Bar (5 Options) */}
      <nav
        aria-label="Navigation principale"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe transition-colors duration-200"
      >
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-all active:scale-90 ${
                  isActive ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.75px]'
                    }`}
                  />
                  {item.id === 'favoris' && favorites.length > 0 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-500 text-slate-950 text-[9px] font-extrabold flex items-center justify-center rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-1 transition-all ${
                    isActive ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 bg-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
