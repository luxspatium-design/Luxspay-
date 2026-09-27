import React, { useState } from 'react';
import {
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  Lock,
  Moon,
  Share2,
  Shield,
  Smartphone,
  Sparkles,
  Sun,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LuxsLogo } from '../LuxsLogo';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    setIsCountryModalOpen,
    setIsShareModalOpen,
    setIsHelpModalOpen,
    setIsSplashModalOpen,
    selectedCountry,
    currency,
    user,
    theme,
    setTheme,
    toggleTheme,
  } = useApp();

  const [notifPromo, setNotifPromo] = useState(true);
  const [notifOrder, setNotifOrder] = useState(true);
  const [activeLang, setActiveLang] = useState<'fr' | 'en'>('fr');

  if (!isSettingsModalOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Paramètres de l'application</h3>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Section: Compte */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Compte & Sécurité
            </span>
            <div className="bg-slate-50 dark:bg-slate-850 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 divide-y divide-slate-100 dark:divide-slate-700/40">
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Informations du compte</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {user.isLoggedIn ? user.email : 'Non connecté'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Sécurité & Code PIN</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Protection des commandes</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 px-2 py-0.5 rounded-md">
                  Actif
                </span>
              </div>
            </div>
          </div>

          {/* Section: Apparence (Dark Mode Toggle) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Apparence (Thème)
            </span>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isDark
                      ? 'bg-amber-400/20 text-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-amber-100 text-amber-600'
                  }`}>
                    {isDark ? (
                      <Moon className="w-5 h-5 fill-amber-400/20 text-amber-400" />
                    ) : (
                      <Sun className="w-5 h-5 fill-amber-500/20 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Mode Sombre
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isDark
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isDark ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isDark
                        ? 'Interface sombre reposante pour le confort visuel'
                        : 'Interface lumineuse et dynamique par défaut'}
                    </span>
                  </div>
                </div>

                {/* Interactive Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isDark}
                  onClick={toggleTheme}
                  title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
                  className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
                    isDark ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span className="sr-only">Activer le mode sombre</span>
                  <span
                    className={`pointer-events-none flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isDark ? 'translate-x-6 text-slate-950' : 'translate-x-0 text-slate-500'
                    }`}
                  >
                    {isDark ? (
                      <Moon className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </span>
                </button>
              </div>

              {/* Segmented Mode Selector for clear 1-click option */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Style d'affichage :
                </span>
                <div className="flex p-0.5 bg-slate-200/70 dark:bg-slate-900 rounded-xl border border-slate-200/40 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      !isDark
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Clair</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isDark
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Sombre</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Préférences régionales */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Région & Devises
            </span>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 divide-y divide-slate-100 dark:divide-slate-700/40">
              <button
                type="button"
                onClick={() => {
                  setIsCountryModalOpen(true);
                }}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-slate-700/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Pays et devise</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {selectedCountry.flag} {selectedCountry.name} ({currency})
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Langue</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveLang('fr')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold ${
                      activeLang === 'fr'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => setActiveLang('en')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold ${
                      activeLang === 'en'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Notifications */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Notifications
            </span>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 divide-y divide-slate-100 dark:divide-slate-700/40">
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Alertes de livraison</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Validation instantanée de recharge</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifOrder}
                  onChange={(e) => setNotifOrder(e.target.checked)}
                  className="w-4 h-4 text-amber-500 focus:ring-amber-400 rounded accent-amber-500"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Offres et promotions</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Bonus de diamants et réductions</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPromo}
                  onChange={(e) => setNotifPromo(e.target.checked)}
                  className="w-4 h-4 text-amber-500 focus:ring-amber-400 rounded accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Autres liens */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Assistance & Partage
            </span>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 divide-y divide-slate-100 dark:divide-slate-700/40">
              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  setIsShareModalOpen(true);
                }}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-slate-700/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Partager LUXSPAY</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  setIsHelpModalOpen(true);
                }}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-slate-700/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Aide / Contact & FAQ</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  setIsSplashModalOpen(true);
                }}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-slate-700/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Aperçu Écran de Démarrage</span>
                </div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                  Splash Screen
                </span>
              </button>

              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Mentions Légales & CGU</span>
                </div>
                <span className="text-[11px] text-slate-400">Conforme UEMOA / CEMAC</span>
              </div>
            </div>
          </div>

          {/* Version & Brand Emblem */}
          <div className="pt-4 text-center flex flex-col items-center gap-2">
            <LuxsLogo size="lg" showTagline={true} layout="vertical" />
            <span className="font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1">
              Version 1.0.0 Officielle • UEMOA & CEMAC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
