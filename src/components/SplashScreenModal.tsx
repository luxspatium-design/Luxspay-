import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { LuxsLogo } from './LuxsLogo';

interface SplashScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SplashScreenModal: React.FC<SplashScreenModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    try {
      sessionStorage.setItem('luxs_seen_splash', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300 p-4">
      {/* Phone-like Container matching Écran de démarrage in mockup */}
      <div className="relative w-full max-w-sm rounded-[38px] bg-white dark:bg-slate-900 border-4 border-amber-400/40 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[580px] p-6 text-center transition-colors">
        {/* Decorative Golden Ambient Rays */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-400/25 via-amber-300/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-400/20 via-yellow-200/10 to-transparent rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        {/* Diagonal stylized background stripes matching mockup */}
        <div className="absolute -top-12 -right-12 w-32 h-64 bg-amber-400/10 rotate-45 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-64 bg-amber-400/10 rotate-45 pointer-events-none" />

        {/* Top Spacer / Status placeholder */}
        <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 dark:text-slate-500 pt-1 px-2 relative z-10">
          <span>07:40</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>LUXSPAY 4G</span>
          </div>
        </div>

        {/* Center: Hero Emblem + Typography + Slogan */}
        <div className="my-auto py-8 relative z-10 flex flex-col items-center">
          {/* Main 3D Emblem (L + Orbit + Controller) */}
          <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
            <LuxsLogo size="2xl" showText={false} />
          </div>

          {/* Typography LUX in Black, SPAY in Gold */}
          <div className="flex items-center tracking-tight leading-none mb-2">
            <span className="font-display font-black text-4xl sm:text-5xl text-slate-950 dark:text-white">
              LUX
            </span>
            <span className="font-display font-black text-4xl sm:text-5xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm">
              SPAY
            </span>
          </div>

          {/* Slogan */}
          <p className="text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-300 tracking-wide mt-1">
            Rechargez • Jouez • Gagnez
          </p>
        </div>

        {/* Bottom Card & CTA */}
        <div className="relative z-10 space-y-4 pb-2">
          {/* Tagline Card */}
          <div className="p-3.5 bg-slate-50/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-xs shadow-xs">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
              Votre univers gaming et numérique en toute sécurité !
            </p>
          </div>

          {/* "Commencer" Yellow Pill Button */}
          <button
            onClick={handleClose}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Commencer</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
