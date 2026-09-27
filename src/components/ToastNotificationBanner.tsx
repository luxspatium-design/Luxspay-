import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  Bell,
  Sparkles,
} from 'lucide-react';
import { LocalToastNotification } from '../types';
import { useApp } from '../context/AppContext';

export const ToastNotificationBanner: React.FC = () => {
  const { toasts, dismissToast, setSelectedOrderForModal } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 flex flex-col gap-2.5 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const getToastTheme = () => {
          switch (toast.status) {
            case 'Complétée':
              return {
                borderClass: 'border-emerald-500/40',
                bgClass: 'bg-slate-950/95 backdrop-blur-md',
                iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
                badgeText: 'Transaction Validée',
                badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
                accentBar: 'bg-emerald-500',
              };
            case 'En cours':
              return {
                borderClass: 'border-amber-500/40',
                bgClass: 'bg-slate-950/95 backdrop-blur-md',
                iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
                icon: <Clock className="w-5 h-5 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />,
                badgeText: 'Traitement En Cours',
                badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                accentBar: 'bg-amber-400',
              };
            case 'Échouée':
              return {
                borderClass: 'border-rose-500/40',
                bgClass: 'bg-slate-950/95 backdrop-blur-md',
                iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
                icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
                badgeText: 'Transaction Échouée',
                badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
                accentBar: 'bg-rose-500',
              };
            default:
              return {
                borderClass: 'border-slate-700',
                bgClass: 'bg-slate-950/95 backdrop-blur-md',
                iconBg: 'bg-slate-800 text-slate-300 border border-slate-700',
                icon: <AlertCircle className="w-5 h-5 text-slate-300 shrink-0" />,
                badgeText: 'Mise à jour',
                badgeClass: 'bg-slate-800 text-slate-300 border border-slate-700',
                accentBar: 'bg-slate-400',
              };
          }
        };

        const theme = getToastTheme();

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full rounded-2xl p-3.5 shadow-2xl border ${theme.borderClass} ${theme.bgClass} text-white relative overflow-hidden transition-all duration-300 animate-in slide-in-from-top-3 fade-in group`}
          >
            {/* Top color indicator line */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${theme.accentBar}`} />

            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${theme.iconBg}`}>
                {theme.icon}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.badgeClass}`}>
                    {theme.badgeText}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {toast.orderId || 'En direct'}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  {toast.title}
                </h4>

                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
                  {toast.message}
                </p>

                {/* Quick actions if order available */}
                {toast.order && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrderForModal(toast.order!);
                        dismissToast(toast.id);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>Voir le reçu complet</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] text-slate-400">
                      ID: {toast.order.playerId}
                    </span>
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Fermer la notification"
                className="p-1 -mr-1 -mt-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
