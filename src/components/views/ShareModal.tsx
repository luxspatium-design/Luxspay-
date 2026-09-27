import React, { useState } from 'react';
import { Check, Copy, QrCode, Share2, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LuxsLogo } from '../LuxsLogo';

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen) return null;

  const shareUrl = window.location.origin || 'https://luxspay.com';
  const shareText = "Rechargez vos jeux préférés (Free Fire, Call of Duty, PUBG...) instantanément sur LUXSPAY avec Mobile Money (Orange, MTN, Wave, Moov) !";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LUXSPAY - Plateforme de recharge de jeux vidéo',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback
      }
    }
    handleCopyLink();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center relative overflow-hidden transition-colors">
        <button
          onClick={() => setIsShareModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5"
        >
          <X className="w-5 h-5" />
        </button>

        <LuxsLogo size="md" className="mb-3" />

        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full mb-1 border border-transparent dark:border-amber-800/40">
          Partagez la passion du jeu
        </span>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Partager LUXSPAY
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
          Invitez vos coéquipiers et amis gamers à profiter des recharges instantanées et des bonus exclusifs.
        </p>

        {/* QR Code Graphic Simulation */}
        <div className="my-5 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center">
          <div className="w-28 h-28 bg-white rounded-xl p-2 flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
              <rect x="10" y="10" width="30" height="30" fill="currentColor" rx="4" />
              <rect x="16" y="16" width="18" height="18" fill="white" rx="2" />
              <rect x="20" y="20" width="10" height="10" fill="currentColor" rx="1" />

              <rect x="60" y="10" width="30" height="30" fill="currentColor" rx="4" />
              <rect x="66" y="16" width="18" height="18" fill="white" rx="2" />
              <rect x="70" y="20" width="10" height="10" fill="currentColor" rx="1" />

              <rect x="10" y="60" width="30" height="30" fill="currentColor" rx="4" />
              <rect x="16" y="66" width="18" height="18" fill="white" rx="2" />
              <rect x="20" y="70" width="10" height="10" fill="currentColor" rx="1" />

              <rect x="50" y="50" width="15" height="15" fill="#F59E0B" rx="2" />
              <rect x="70" y="60" width="20" height="8" fill="currentColor" rx="2" />
              <rect x="70" y="74" width="8" height="16" fill="currentColor" rx="2" />
              <rect x="82" y="74" width="8" height="8" fill="currentColor" rx="2" />
            </svg>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono">Scanner pour recharger</span>
        </div>

        {/* Primary Action: "Partager mon site" */}
        <button
          onClick={handleNativeShare}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mb-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Partager mon site</span>
        </button>

        {/* Copy Link Input */}
        <div className="w-full flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-xs text-slate-600 dark:text-slate-300 px-2 font-mono truncate focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-650 transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
