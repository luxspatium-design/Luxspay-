import React, { useState } from 'react';
import {
  Calendar,
  Check,
  CreditCard,
  Database,
  DollarSign,
  Gamepad2,
  Lock,
  MessageCircle,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { COUNTRIES, GAMES } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const AdminPanelModal: React.FC = () => {
  const {
    isAdminPanelOpen,
    setIsAdminPanelOpen,
    adminConfig,
    updateAdminConfig,
    orders,
    currency,
    updateOrderStatus,
  } = useApp();

  const [promoText, setPromoText] = useState(adminConfig.promoText);
  const [whatsappNumber, setWhatsappNumber] = useState(adminConfig.whatsappNumber);
  const [rewardsMonths, setRewardsMonths] = useState(adminConfig.rewardsDurationMonths);
  const [conversionRate, setConversionRate] = useState(adminConfig.conversionRateXOFtoXAF);
  const [saveSuccess, setSaveSuccess] = useState(false);

  type AdminTab = 'general' | 'catalogue' | 'devises' | 'commandes';
  const [adminTab, setAdminTab] = useState<AdminTab>('general');

  if (!isAdminPanelOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminConfig({
      promoText,
      whatsappNumber,
      rewardsDurationMonths: Number(rewardsMonths) || 3,
      conversionRateXOFtoXAF: Number(conversionRate) || 1.0,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display">Console d'Administration LUXSPAY</h3>
                <span className="text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">
                  DEMO ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gestion dynamique des prix, packs, pays, devises, récompenses et WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminPanelOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Nav */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-4 pt-2 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setAdminTab('general')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-colors ${
              adminTab === 'general'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-t border-x border-slate-200 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Général & WhatsApp
          </button>
          <button
            onClick={() => setAdminTab('devises')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-colors ${
              adminTab === 'devises'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-t border-x border-slate-200 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Devises & Taux XOF/XAF
          </button>
          <button
            onClick={() => setAdminTab('catalogue')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-colors ${
              adminTab === 'catalogue'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-t border-x border-slate-200 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Catalogue (14 Jeux)
          </button>
          <button
            onClick={() => setAdminTab('commandes')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-colors ${
              adminTab === 'commandes'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-t border-x border-slate-200 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Transactions ({orders.length})
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
          {adminTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Texte de la bannière promotionnelle principale :
                </label>
                <input
                  type="text"
                  value={promoText}
                  onChange={(e) => setPromoText(e.target.value)}
                  placeholder="Ex: Rechargez • Jouez • Gagnez"
                  className="w-full bg-slate-50 focus:bg-white dark:bg-slate-800 dark:focus:bg-slate-750 text-sm text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Numéro WhatsApp du Service Client (sans symbole +) :
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="2250700000000"
                    className="flex-1 bg-slate-50 focus:bg-white dark:bg-slate-800 dark:focus:bg-slate-750 text-sm font-mono text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Utilisé pour le bouton flottant et l'aide ID
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Durée de validité des récompenses (en mois) :
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={rewardsMonths}
                    onChange={(e) => setRewardsMonths(Number(e.target.value))}
                    className="w-24 bg-slate-50 focus:bg-white dark:bg-slate-800 dark:focus:bg-slate-750 text-sm text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Valeur par défaut recommandée : <strong>3 mois</strong>
                  </span>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'devises' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300">
                <h4 className="font-bold text-sm mb-1">Conversion Multi-Devises XOF / XAF</h4>
                <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-400">
                  LUXSPAY supporte exclusivement le <strong>Franc CFA Afrique de l'Ouest (XOF)</strong> et le <strong>Franc CFA Afrique centrale (XAF)</strong>. Les prix s'adaptent automatiquement selon le pays choisi par le client.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Taux de parité 1 XOF en XAF :
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(parseFloat(e.target.value) || 1.0)}
                  className="w-32 bg-slate-50 focus:bg-white dark:bg-slate-800 dark:focus:bg-slate-750 text-sm font-mono text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">
                  Parité monétaire standard : 1 XOF = 1 XAF (parité 1:1)
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">13 Pays configurés :</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COUNTRIES.map((c) => (
                    <div key={c.code} className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{c.flag} {c.name}</span>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">{c.currency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'catalogue' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                14 Jeux officiels configurés avec packs et régions :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                {GAMES.map((game, i) => (
                  <div key={game.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-slate-400 font-bold">{i + 1}.</span>
                        <span className="font-bold text-slate-900 dark:text-white">{game.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block ml-7">
                        {game.packs.length} packs · {game.tokenName}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/40 dark:border-emerald-800/40">
                      En ligne
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'commandes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs sm:text-sm">
                  Journal des transactions ({orders.length}) :
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Modifiez le statut pour tester les push toasts
                </span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{ord.id}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">· {ord.gameName}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        ID: {ord.playerId} ({ord.serverRegion}) · {ord.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white block font-display text-xs">
                          {ord.amount.toLocaleString('fr-FR')} {ord.currency}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{ord.date}</span>
                      </div>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className={`text-xs font-bold px-2 py-1 rounded-xl border ${
                          ord.status === 'Complétée'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : ord.status === 'En cours'
                            ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                        }`}
                      >
                        <option value="Complétée">Complétée</option>
                        <option value="En cours">En cours</option>
                        <option value="Échouée">Échouée</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {saveSuccess ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" /> Paramètres enregistrés avec succès !
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500">
                Les modifications s'appliquent immédiatement à la plateforme.
              </span>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
