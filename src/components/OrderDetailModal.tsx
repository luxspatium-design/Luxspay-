import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Copy,
  Download,
  ExternalLink,
  MessageCircle,
  Share2,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LuxsLogo } from './LuxsLogo';

export const OrderDetailModal: React.FC = () => {
  const {
    selectedOrderForModal,
    setSelectedOrderForModal,
    openWhatsAppSupport,
  } = useApp();

  if (!selectedOrderForModal) return null;

  const order = selectedOrderForModal;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
  };

  const getStatusConfig = () => {
    switch (order.status) {
      case 'Complétée':
        return {
          icon: <CheckCircle2 className="w-7 h-7" />,
          iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
          badgeText: 'Livraison instantanée validée',
          badgeClass: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
          badgeIcon: <ShieldCheck className="w-3.5 h-3.5" />,
          statusLabel: 'Validée / Créditée',
          statusClass: 'font-bold text-emerald-600 dark:text-emerald-400',
        };
      case 'En cours':
        return {
          icon: <Clock className="w-7 h-7 animate-pulse" />,
          iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
          badgeText: 'Paiement reçu — Traitement en cours',
          badgeClass: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
          badgeIcon: <Clock className="w-3.5 h-3.5" />,
          statusLabel: 'En attente de livraison',
          statusClass: 'font-bold text-amber-600 dark:text-amber-400',
        };
      case 'Échouée':
        return {
          icon: <XCircle className="w-7 h-7" />,
          iconBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
          badgeText: 'Paiement non débité ou rejeté',
          badgeClass: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
          badgeIcon: <AlertCircle className="w-3.5 h-3.5" />,
          statusLabel: 'Transaction échouée',
          statusClass: 'font-bold text-rose-600 dark:text-rose-400',
        };
      default:
        return {
          icon: <AlertCircle className="w-7 h-7" />,
          iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
          badgeText: 'Statut en attente de vérification',
          badgeClass: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          badgeIcon: <AlertCircle className="w-3.5 h-3.5" />,
          statusLabel: order.status,
          statusClass: 'font-bold text-slate-600 dark:text-slate-300',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Receipt Header Banner */}
        <div className="p-6 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center text-center relative">
          <button
            onClick={() => setSelectedOrderForModal(null)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <LuxsLogo size="sm" />

          <div
            className={`mt-4 flex items-center justify-center w-12 h-12 rounded-full ${statusConfig.iconBg} mb-2`}
          >
            {statusConfig.icon}
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Reçu de Commande</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">{order.id}</span>
            <button
              onClick={handleCopyOrderId}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 p-1"
              title="Copier le numéro de commande"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold ${statusConfig.badgeClass}`}
          >
            {statusConfig.badgeIcon}
            <span>{statusConfig.badgeText}</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="p-5 overflow-y-auto space-y-4 divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {/* Item details */}
          <div className="flex items-center gap-3 pt-1">
            <img
              src={order.gameImage}
              alt={order.gameName}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">{order.gameName}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{order.packName}</p>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                {order.tokensCount.toLocaleString('fr-FR')} {order.tokenName}
              </p>
            </div>
          </div>

          {/* Key Facts Grid */}
          <div className="pt-3 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Statut</span>
              <span className={statusConfig.statusClass}>{statusConfig.statusLabel}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Montant total</span>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
                {order.amount.toLocaleString('fr-FR')} {order.currency}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Moyen de paiement</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">ID Joueur crédité</span>
              <span className="font-mono font-bold text-slate-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-transparent dark:border-amber-800/40">
                {order.playerId}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Serveur / Région</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{order.serverRegion}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Date et heure</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {order.date} à {order.time}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Email de confirmation</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{order.playerEmail}</span>
            </div>

            {order.playerPhone && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Numéro de téléphone</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{order.playerPhone}</span>
              </div>
            )}
          </div>

          {/* Need help row */}
          <div className="pt-3">
            <button
              onClick={() =>
                openWhatsAppSupport(
                  `Bonjour LUXSPAY, j'ai une question au sujet de ma commande ${order.id} pour ${order.gameName} (${order.playerId}) [Statut: ${order.status}].`
                )
              }
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Assistance WhatsApp pour cette commande</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <button
            onClick={() => setSelectedOrderForModal(null)}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
