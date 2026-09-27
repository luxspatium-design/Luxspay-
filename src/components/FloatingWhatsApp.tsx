import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LuxsLogo } from './LuxsLogo';

export const FloatingWhatsApp: React.FC = () => {
  const { openWhatsAppSupport } = useApp();

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-30 flex flex-col items-end gap-2 group">
      {/* Tooltip on Desktop hover */}
      <div className="hidden md:flex items-center gap-2 bg-slate-900 text-white text-xs font-medium py-1.5 px-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span>Support WhatsApp LUXSPAY</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      <button
        onClick={() => openWhatsAppSupport("Bonjour LUXSPAY, j'ai besoin d'une assistance pour recharger mon jeu.")}
        className="relative flex items-center justify-center w-13 h-13 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300/50"
        aria-label="Contacter le service client WhatsApp"
      >
        {/* LUXSPAY Emblem Logo in center */}
        <LuxsLogo size="sm" showText={false} className="drop-shadow-sm scale-90" />

        {/* Little WhatsApp badge at top-right corner */}
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-emerald-500 text-white rounded-full shadow-sm ring-2 ring-white">
          <MessageCircle className="w-3 h-3 fill-current" />
        </span>

        {/* Pulse ring animation */}
        <span className="absolute inset-0 rounded-full bg-amber-400 opacity-20 animate-ping -z-10" />
      </button>
    </div>
  );
};
