import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  Receipt,
  ChevronRight,
  Copy,
  Check,
  ShoppingBag,
  Filter,
  ArrowUpDown,
  RefreshCw,
  BellRing,
  MoreVertical,
} from 'lucide-react';
import { Order } from '../types';
import { useApp } from '../context/AppContext';

interface TransactionHistoryProps {
  onSelectOrder?: (order: Order) => void;
  maxHeight?: string;
  className?: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  onSelectOrder,
  maxHeight = 'max-h-[460px]',
  className = '',
}) => {
  const {
    orders,
    setSelectedOrderForModal,
    setActiveTab,
    formatPrice,
    updateOrderStatus,
    simulateLiveStatusUpdate,
  } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | 'Complétée' | 'En cours' | 'Échouée'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMenuOrderId, setActiveMenuOrderId] = useState<string | null>(null);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const handleItemClick = (order: Order) => {
    if (onSelectOrder) {
      onSelectOrder(order);
    } else {
      setSelectedOrderForModal(order);
    }
  };

  const handleStatusChange = (
    e: React.MouseEvent,
    orderId: string,
    newStatus: Order['status']
  ) => {
    e.stopPropagation();
    setActiveMenuOrderId(null);
    updateOrderStatus(orderId, newStatus);
  };

  // Status visual configuration
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Complétée':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
          label: 'Validée',
          pillClass: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
          dotClass: 'bg-emerald-500',
          description: 'Recharge créditée avec succès',
        };
      case 'En cours':
        return {
          icon: <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />,
          label: 'En attente',
          pillClass: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
          dotClass: 'bg-amber-500',
          description: 'Traitement opérateur en cours',
        };
      case 'Échouée':
        return {
          icon: <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
          label: 'Échouée',
          pillClass: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60',
          dotClass: 'bg-rose-500',
          description: 'Paiement non débité ou rejeté',
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />,
          label: status,
          pillClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dotClass: 'bg-slate-400',
          description: 'Statut de transaction inconnu',
        };
    }
  };

  // Status counts for filter pills
  const counts = useMemo(() => {
    return {
      all: orders.length,
      success: orders.filter((o) => o.status === 'Complétée').length,
      pending: orders.filter((o) => o.status === 'En cours').length,
      failed: orders.filter((o) => o.status === 'Échouée').length,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
      const term = searchTerm.trim().toLowerCase();
      if (!term) return matchesStatus;

      const matchesSearch =
        ord.id.toLowerCase().includes(term) ||
        ord.gameName.toLowerCase().includes(term) ||
        ord.packName.toLowerCase().includes(term) ||
        ord.playerId.toLowerCase().includes(term) ||
        ord.paymentMethod.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4 transition-colors duration-200 ${className}`}
    >
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/15 via-amber-400/20 to-yellow-300/30 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200/50 dark:border-amber-400/20">
            <Receipt className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-display">
                Historique des Recharges
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                {orders.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Suivi en temps réel de vos recharges et reçus de paiement
            </p>
          </div>
        </div>

        {/* Quick filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
            }`}
          >
            Toutes ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Complétée')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-all ${
              statusFilter === 'Complétée'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Succès ({counts.success})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('En cours')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-all ${
              statusFilter === 'En cours'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100/80 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>En attente ({counts.pending})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Échouée')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-all ${
              statusFilter === 'Échouée'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40'
            }`}
          >
            <XCircle className="w-3 h-3" />
            <span>Échec ({counts.failed})</span>
          </button>

          {/* Simulate Live Status change button for real-time test */}
          <button
            type="button"
            onClick={() => simulateLiveStatusUpdate()}
            title="Tester la notification push en temps réel lors d'une mise à jour de statut"
            className="px-2.5 py-1 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-300 shadow-xs border border-amber-400/30 transition-all active:scale-95 ml-auto"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span className="hidden sm:inline">Simuler statut en direct</span>
            <span className="sm:hidden">Simuler</span>
          </button>
        </div>
      </div>

      {/* Search Input Filter */}
      {orders.length > 2 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par jeu, ID joueur, référence (LX-...)..."
            className="w-full bg-slate-50 focus:bg-white dark:bg-slate-800 dark:focus:bg-slate-750 text-xs text-slate-900 dark:text-white pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Scrollable Transaction List */}
      {filteredOrders.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {searchTerm || statusFilter !== 'all'
                ? 'Aucune transaction trouvée'
                : 'Aucune transaction enregistrée'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              {searchTerm || statusFilter !== 'all'
                ? 'Essayez de modifier vos filtres de recherche ou réinitialisez le filtre de statut.'
                : 'Effectuez votre première recharge de jeux sur LUXSPAY pour voir apparaître vos reçus ici.'}
            </p>
          </div>

          {searchTerm || statusFilter !== 'all' ? (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-4 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50 rounded-xl transition-colors"
            >
              Réinitialiser les filtres
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('boutique')}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explorer la boutique</span>
            </button>
          )}
        </div>
      ) : (
        <div className={`overflow-y-auto ${maxHeight} pr-1.5 space-y-2.5`}>
          {filteredOrders.map((ord) => {
            const badge = getStatusBadge(ord.status);
            const isCopied = copiedId === ord.id;

            return (
              <div
                key={ord.id}
                onClick={() => handleItemClick(ord)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleItemClick(ord);
                  }
                }}
                className="w-full text-left p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 hover:shadow-sm bg-white dark:bg-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/90 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              >
                {/* Left Part: Game details & ID */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  {/* Game Thumbnail */}
                  <div className="relative shrink-0">
                    <img
                      src={ord.gameImage}
                      alt={ord.gameName}
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border border-slate-200/80 dark:border-slate-700 shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=120&q=80';
                      }}
                    />
                    {/* Status mini dot indicator directly on image */}
                    <span
                      className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center ${badge.dotClass}`}
                      title={badge.label}
                    />
                  </div>

                  {/* Text descriptions */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                        {ord.gameName}
                      </h4>

                      {/* Transaction ID with 1-click copy */}
                      <button
                        type="button"
                        onClick={(e) => handleCopyId(e, ord.id)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-1.5 py-0.5 rounded-md transition-colors"
                        title="Copier la référence"
                      >
                        <span>{ord.id}</span>
                        {isCopied ? (
                          <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 opacity-60" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5 truncate">
                      <span>{ord.packName}</span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">
                        +{ord.tokensCount.toLocaleString('fr-FR')} {ord.tokenName}
                      </span>
                    </div>

                    {/* Metadata line: Date, Time, Payment, Player ID */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-400 mt-1 flex-wrap">
                      <span>
                        {ord.date} à {ord.time}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[10px]">
                        {ord.paymentMethod}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        ID: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{ord.playerId}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Part: Price & Status Icon Pill */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800 shrink-0 gap-1.5 sm:gap-1">
                  {/* Amount */}
                  <div className="text-left sm:text-right">
                    <span className="text-xs sm:text-base font-black text-slate-900 dark:text-white block font-display tracking-tight">
                      {ord.amount.toLocaleString('fr-FR')} {ord.currency}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
                      TTC
                    </span>
                  </div>

                  {/* Status Badge with explicit icon (Success, Pending, Failed) & Quick Switch dropdown */}
                  <div className="flex items-center gap-1.5 relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuOrderId((prev) => (prev === ord.id ? null : ord.id));
                      }}
                      title="Changer le statut pour tester la notification push locale"
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs hover:scale-102 transition-all ${badge.pillClass}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                      <RefreshCw className="w-2.5 h-2.5 opacity-50 hover:opacity-100 ml-0.5" />
                    </button>

                    {/* Popover menu to simulate real-time status update */}
                    {activeMenuOrderId === ord.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1.5 z-40 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700/80 p-1.5 min-w-[170px] animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                          Mettre à jour le statut :
                        </div>
                        <div className="pt-1 space-y-0.5">
                          <button
                            type="button"
                            onClick={(e) => handleStatusChange(e, ord.id, 'Complétée')}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-800 text-emerald-400 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Validée (Succès)</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleStatusChange(e, ord.id, 'En cours')}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-800 text-amber-400 transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>En cours (Attente)</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleStatusChange(e, ord.id, 'Échouée')}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-800 text-rose-400 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Échouée (Rejet)</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all hidden sm:block" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info / Hint */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span>Touchez une transaction pour afficher le reçu complet ou contacter le support</span>
        <span className="font-medium text-slate-500 dark:text-slate-400">LUXSPAY Sécurisé</span>
      </div>
    </div>
  );
};
