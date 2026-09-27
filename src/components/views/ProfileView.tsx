import React, { useState } from 'react';
import {
  Award,
  ChevronRight,
  Clock,
  Coins,
  Copy,
  ExternalLink,
  Gift,
  HelpCircle,
  History,
  Lock,
  LogOut,
  Mail,
  Phone,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  Sparkles,
  Trash2,
  User,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionHistory } from '../TransactionHistory';

export const ProfileView: React.FC = () => {
  const {
    user,
    loginUser,
    logoutUser,
    orders,
    formatPrice,
    setSelectedOrderForModal,
    savedPlayerIds,
    removeSavedPlayerId,
    setIsSettingsModalOpen,
    setIsShareModalOpen,
    setIsHelpModalOpen,
    setActiveTab,
  } = useApp();

  // Manual register/login modal or toggle
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPseudo, setAuthPseudo] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Total tokens & spent calculation
  const totalSpentCalculated = orders.reduce((acc, curr) => acc + curr.amount, 0);
  const totalTokensCalculated = orders.reduce((acc, curr) => acc + curr.tokensCount, 0);

  const handleManualAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;

    loginUser(
      'email',
      authPseudo.trim() || authEmail.split('@')[0],
      authEmail.trim(),
      authPhone.trim() || undefined
    );
    setShowAuthModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24 md:pb-12 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs relative overflow-hidden transition-colors duration-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -z-0" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative">
              {user.isLoggedIn && user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.pseudo}
                  className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 shadow-md ring-4 ring-amber-50 dark:ring-amber-950/40"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center">
                  <User className="w-10 h-10" />
                </div>
              )}

              {user.isLoggedIn && (
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-slate-900 text-amber-400 text-[10px] font-black rounded-full border border-amber-400">
                  NIV. {user.level}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                  {user.isLoggedIn ? user.pseudo : 'Joueur Invité'}
                </h1>
                {user.isLoggedIn && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50 rounded-md">
                    {user.vipTier}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user.isLoggedIn && user.email ? user.email : 'Connectez-vous pour synchroniser vos recharges'}
              </p>

              {user.isLoggedIn && user.phone && (
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 block mt-0.5">
                  {user.phone}
                </span>
              )}
            </div>
          </div>

          {/* Auth / Action Button */}
          <div className="flex items-center gap-2">
            {user.isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  title="Paramètres"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={logoutUser}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all"
              >
                Se connecter / S'inscrire
              </button>
            )}
          </div>
        </div>

        {/* 3 STATS CARDS */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-transparent dark:border-slate-800">
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold block">
              Total Dépensé
            </span>
            <span className="text-sm sm:text-lg font-black text-slate-900 dark:text-white font-display block mt-0.5">
              {formatPrice(totalSpentCalculated, totalSpentCalculated)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-transparent dark:border-slate-800">
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold block">
              Commandes
            </span>
            <span className="text-sm sm:text-lg font-black text-slate-900 dark:text-white font-display block mt-0.5">
              {orders.length}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-transparent dark:border-slate-800">
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold block">
              Jetons Achetés
            </span>
            <span className="text-sm sm:text-lg font-black text-amber-600 dark:text-amber-400 font-display block mt-0.5">
              {totalTokensCalculated.toLocaleString('fr-FR')}
            </span>
          </div>
        </div>
      </div>

      {/* QUICK SHORTCUT ACTIONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 text-left transition-all flex items-center gap-3 shadow-xs"
        >
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Paramètres</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Thème & devises</span>
          </div>
        </button>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 text-left transition-all flex items-center gap-3 shadow-xs"
        >
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Partager</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Inviter des amis</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('recompenses')}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 text-left transition-all flex items-center gap-3 shadow-xs"
        >
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Récompenses</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Mes avantages</span>
          </div>
        </button>

        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 text-left transition-all flex items-center gap-3 shadow-xs"
        >
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Assistance</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">WhatsApp & FAQ</span>
          </div>
        </button>
      </div>

      {/* SECTION 1: GESTION DES IDS SAUVEGARDÉS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">IDs de Joueur Sauvegardés</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Mémorisés pour recharger plus vite vos comptes</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
            {savedPlayerIds.length} sauvegardé{savedPlayerIds.length > 1 ? 's' : ''}
          </span>
        </div>

        {savedPlayerIds.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">
            Aucun ID sauvegardé pour l'instant. Lors d'une recharge, cochez « Sauvegarder cet ID ».
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {savedPlayerIds.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                      {item.gameId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">{item.playerId}</span>
                    <span>·</span>
                    <span>{item.serverRegion}</span>
                  </div>
                </div>

                <button
                  onClick={() => removeSavedPlayerId(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  title="Supprimer cet ID"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: HISTORIQUE DES TRANSACTIONS & RECHARGES */}
      <TransactionHistory />

      {/* LOGIN / SIGNUP MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col relative overflow-hidden">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full">
                Compte LUXSPAY
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 font-display">
                {authMode === 'login' ? 'Connexion à votre compte' : 'Créer un compte LUXSPAY'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Synchronisez vos recharges, récompenses et classements
              </p>
            </div>

            {/* Social Logins (Google, Facebook, Apple) */}
            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  loginUser('google', 'Joueur_Google', 'joueur.google@gmail.com');
                  setShowAuthModal(false);
                }}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.02h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.02c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.12C3.25 21.31 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.3c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V6.58H1.27C.46 8.2.01 10.05.01 12s.45 3.8 1.26 5.42l4.01-3.12z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.58l4.01 3.12c.95-2.83 3.6-4.95 6.72-4.95z"
                  />
                </svg>
                <span>Continuer avec Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginUser('apple', 'Joueur_Apple', 'joueur.apple@icloud.com');
                  setShowAuthModal(false);
                }}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700"
              >
                <span className="text-base leading-none"></span>
                <span>Continuer avec Apple</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginUser('facebook', 'Joueur_Facebook', 'joueur.fb@facebook.com');
                  setShowAuthModal(false);
                }}
                className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span className="font-black text-sm">f</span>
                <span>Continuer avec Facebook</span>
              </button>
            </div>

            <div className="relative my-3 text-center">
              <span className="bg-white dark:bg-slate-900 px-2 text-[11px] text-slate-400 dark:text-slate-500 relative z-10 font-medium">
                Ou par e-mail
              </span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleManualAuth} className="space-y-3">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Pseudo
                  </label>
                  <input
                    type="text"
                    value={authPseudo}
                    onChange={(e) => setAuthPseudo(e.target.value)}
                    placeholder="Ex: ProGamer225"
                    className="w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-750 text-xs text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Adresse e-mail <span className="text-amber-600 dark:text-amber-400 font-bold">* Obligatoire</span>
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="votre.email@domaine.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-750 text-xs text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Numéro de téléphone <span className="text-slate-400 dark:text-slate-500 font-normal">(Facultatif)</span>
                  </label>
                  <input
                    type="tel"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="+225 00 00 00 00"
                    className="w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-750 text-xs text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-750 text-xs text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                {authMode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 font-semibold"
              >
                {authMode === 'login'
                  ? "Pas encore de compte ? S'inscrire"
                  : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
