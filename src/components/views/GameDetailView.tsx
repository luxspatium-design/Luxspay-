import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  HelpCircle,
  Heart,
  Info,
  Lock,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Mail,
  UserCheck,
} from 'lucide-react';
import { Game, GamePack, Order } from '../../types';
import { useApp } from '../../context/AppContext';

interface GameDetailViewProps {
  game: Game;
  onBack: () => void;
}

export const GameDetailView: React.FC<GameDetailViewProps> = ({ game, onBack }) => {
  const {
    selectedCountry,
    currency,
    formatPrice,
    isFavorite,
    toggleFavorite,
    savedPlayerIds,
    savePlayerId,
    createOrder,
    lastOrderSuccess,
    setLastOrderSuccess,
    openWhatsAppSupport,
    user,
    setSelectedOrderForModal,
    setIsShareModalOpen,
  } = useApp();

  // Local Recharge Form State
  const [selectedRegion, setSelectedRegion] = useState<string>(game.regions[0] || 'Global');
  const [playerId, setPlayerId] = useState<string>('');
  const [shouldSaveId, setShouldSaveId] = useState<boolean>(true);
  const [idLabel, setIdLabel] = useState<string>('Compte Principal');
  const [selectedPack, setSelectedPack] = useState<GamePack | null>(game.packs[1] || game.packs[0] || null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    selectedCountry.paymentMethods[0] || 'Mobile Money'
  );
  const [playerPhone, setPlayerPhone] = useState<string>(user.phone || '');
  const [playerEmail, setPlayerEmail] = useState<string>(user.email || '');

  // ID Help Modal State
  const [showIdHelpModal, setShowIdHelpModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Matching saved IDs for this game
  const matchingSavedIds = savedPlayerIds.filter((item) => item.gameId === game.id);

  // Auto-fill if there is a saved ID
  useEffect(() => {
    if (matchingSavedIds.length > 0 && !playerId) {
      setPlayerId(matchingSavedIds[0].playerId);
      if (matchingSavedIds[0].serverRegion && game.regions.includes(matchingSavedIds[0].serverRegion)) {
        setSelectedRegion(matchingSavedIds[0].serverRegion);
      }
    }
  }, [game.id]);

  // Keep payment method synchronized with country's available options
  useEffect(() => {
    if (!selectedCountry.paymentMethods.includes(selectedPaymentMethod)) {
      setSelectedPaymentMethod(selectedCountry.paymentMethods[0] || '');
    }
  }, [selectedCountry]);

  const favorited = isFavorite(game.id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Recharger ${game.name} sur LUXSPAY`,
          text: `Rechargez vos ${game.tokenName} sur ${game.name} instantanément avec LUXSPAY !`,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback
      }
    }
    setIsShareModalOpen(true);
  };

  const handleApplySavedId = (saved: typeof matchingSavedIds[0]) => {
    setPlayerId(saved.playerId);
    if (game.regions.includes(saved.serverRegion)) {
      setSelectedRegion(saved.serverRegion);
    }
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!playerId.trim()) {
      setErrorMessage("Veuillez saisir votre ID de joueur pour recevoir vos jetons.");
      return;
    }

    if (!selectedPack) {
      setErrorMessage("Veuillez choisir un pack de recharge.");
      return;
    }

    if (!selectedPaymentMethod) {
      setErrorMessage("Veuillez choisir un moyen de paiement.");
      return;
    }

    if (!playerEmail.trim() || !playerEmail.includes('@')) {
      setErrorMessage("Une adresse e-mail valide est obligatoire pour recevoir votre reçu et confirmation.");
      return;
    }

    setIsSubmitting(true);

    // Save ID if checkbox checked
    if (shouldSaveId && playerId.trim()) {
      savePlayerId(game.id, playerId.trim(), selectedRegion, idLabel.trim() || 'Mon Compte');
    }

    // Simulate fast processing
    setTimeout(() => {
      const priceToCharge = currency === 'XAF' ? selectedPack.priceXAF : selectedPack.priceXOF;

      const newOrder = createOrder({
        gameId: game.id,
        gameName: game.name,
        gameImage: game.image,
        packName: selectedPack.name,
        tokensCount: selectedPack.tokensCount,
        tokenName: game.tokenName,
        amount: priceToCharge,
        currency: currency,
        paymentMethod: selectedPaymentMethod,
        playerPhone: playerPhone.trim(),
        playerEmail: playerEmail.trim(),
        playerId: playerId.trim(),
        serverRegion: selectedRegion,
      });

      setIsSubmitting(false);
      setOrderComplete(newOrder);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  };

  // SUCCESS SCREEN
  if (orderComplete) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 md:p-8 text-center transition-colors">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50 dark:ring-emerald-950/30">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
            Livraison Instantanée Réussie
          </span>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3 font-display">
            Commande réussie !
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Vos {game.tokenName} ont été crédités avec succès sur votre compte de jeu.
          </p>

          {/* Receipt Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/60 my-6 text-left space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{game.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{orderComplete.packName}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-lg border border-amber-200/40 dark:border-amber-800/40">
                +{orderComplete.tokensCount} {game.tokenName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Numéro de commande</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{orderComplete.id}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Montant payé</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {orderComplete.amount.toLocaleString('fr-FR')} {orderComplete.currency}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">ID Joueur</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{orderComplete.playerId}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Région / Serveur</span>
                <span className="font-medium text-slate-900 dark:text-slate-200">{orderComplete.serverRegion}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Mode de paiement</span>
                <span className="font-medium text-slate-900 dark:text-slate-200">{orderComplete.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Statut</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Validée</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
              Un reçu de confirmation a été envoyé à <strong className="text-slate-700 dark:text-slate-200">{orderComplete.playerEmail}</strong>.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => {
                setSelectedOrderForModal(orderComplete);
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Info className="w-4 h-4" />
              <span>Voir le reçu complet & Détails</span>
            </button>

            <button
              onClick={() => {
                setOrderComplete(null);
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
            >
              Effectuer une autre recharge
            </button>

            <button
              onClick={onBack}
              className="w-full py-2.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
            >
              Retourner à la Boutique
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-24 md:pb-12">
      {/* Top Bar with Back, Title, Favorite & Share */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Boutique</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite Toggle Button */}
          <button
            onClick={() => toggleFavorite(game.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
              favorited
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart
              className={`w-4 h-4 ${
                favorited ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
              }`}
            />
            <span className="hidden sm:inline">
              {favorited ? 'Dans mes favoris' : 'Ajouter aux favoris'}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Partager ce jeu"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game Showcase Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden mb-6 transition-colors">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
          <img
            src={game.bannerImage || game.image}
            alt={game.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Content overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={game.image}
                alt={game.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/90 shadow-lg shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Recharge Officielle LUXSPAY
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white font-display leading-tight">
                  {game.name}
                </h1>
                <p className="text-xs text-slate-300 mt-0.5">
                  Monnaie : <strong className="text-amber-400">{game.tokenName}</strong> · Livraison en ~30 secondes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="px-5 py-2.5 bg-slate-50/80 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            100% Sécurisé & Direct ID
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Aucun mot de passe requis
          </span>
        </div>
      </div>

      {/* RECHARGE FORM */}
      <form onSubmit={handleConfirmPayment} className="space-y-6">
        {/* STEP 1: Select Region / Server */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sélectionnez la région / serveur</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {game.regions.map((reg) => {
              const isSelected = selectedRegion === reg;
              return (
                <button
                  type="button"
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 text-slate-950 dark:text-amber-300 font-bold ring-1 ring-amber-400'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs">{reg}</span>
                  {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Player ID & Saved IDs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Entrez votre ID de joueur</h3>
            </div>

            {/* "Comment trouver mon ID ?" Button */}
            <button
              type="button"
              onClick={() => setShowIdHelpModal(true)}
              className="text-xs text-amber-700 dark:text-amber-300 font-bold hover:underline flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-transparent dark:border-amber-800/40 px-2.5 py-1 rounded-lg"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Comment trouver mon ID ?</span>
            </button>
          </div>

          {/* Quick Saved IDs Chips if any */}
          {matchingSavedIds.length > 0 && (
            <div className="mb-3 p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/50 dark:border-amber-800/40">
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 block mb-1.5">
                IDs sauvegardés pour {game.name} :
              </span>
              <div className="flex wrap gap-1.5">
                {matchingSavedIds.map((saved) => (
                  <button
                    type="button"
                    key={saved.id}
                    onClick={() => handleApplySavedId(saved)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      playerId === saved.playerId
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{saved.label} ({saved.playerId})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Field */}
          <div className="relative">
            <input
              type="text"
              required
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder={`Ex: ${game.idHelpGuide.sampleId}`}
              className="w-full bg-slate-50 focus:bg-white dark:bg-slate-800 dark:focus:bg-slate-750 text-slate-900 dark:text-white font-mono text-sm px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 dark:focus:border-amber-400 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Option: Sauvegarder cet ID */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={shouldSaveId}
                onChange={(e) => setShouldSaveId(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sauvegarder cet ID pour mes prochaines recharges
              </span>
            </label>

            {shouldSaveId && (
              <input
                type="text"
                value={idLabel}
                onChange={(e) => setIdLabel(e.target.value)}
                placeholder="Nom du compte (ex: Principal)"
                className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-400 max-w-[200px]"
              />
            )}
          </div>
        </div>

        {/* STEP 3: Jetons / Packs Selection (1 Pack at a time) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sélectionnez votre pack de {game.tokenName}
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">1 seul pack par recharge</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {game.packs.map((pack) => {
              const isSelected = selectedPack?.id === pack.id;
              const formattedPrice = formatPrice(pack.priceXOF, pack.priceXAF);

              return (
                <button
                  type="button"
                  key={pack.id}
                  onClick={() => setSelectedPack(pack)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[100px] ${
                    isSelected
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 shadow-sm ring-2 ring-amber-400'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {/* Badge */}
                  {pack.bonusText && (
                    <span className="absolute -top-2 right-2 text-[10px] font-black uppercase tracking-tight bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                      {pack.bonusText}
                    </span>
                  )}

                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block leading-snug">
                      {pack.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      {pack.tokensCount} {game.tokenName}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {formattedPrice}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 4: Modes de paiement (strictly depends on selected country) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mode de paiement</h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {selectedCountry.paymentMethods.map((method) => {
              const isSelected = selectedPaymentMethod === method;
              return (
                <button
                  type="button"
                  key={method}
                  onClick={() => setSelectedPaymentMethod(method)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 font-bold text-slate-950 dark:text-amber-300 ring-2 ring-amber-400'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs font-bold">{method}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Sans frais</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 5: Phone & Mandatory Email */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center">
              5
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Coordonnées de validation</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Numéro de téléphone <span className="text-slate-400 dark:text-slate-500 font-normal">(modifié à chaque commande)</span>
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={playerPhone}
                  onChange={(e) => setPlayerPhone(e.target.value)}
                  placeholder={`${selectedCountry.dialCode} 00 00 00 00`}
                  className="w-full bg-slate-50 focus:bg-white dark:bg-slate-800 dark:focus:bg-slate-750 text-sm text-slate-900 dark:text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 dark:focus:border-amber-400 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Adresse e-mail <span className="text-amber-600 dark:text-amber-400 font-bold">* Obligatoire</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={playerEmail}
                  onChange={(e) => setPlayerEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className="w-full bg-slate-50 focus:bg-white dark:bg-slate-800 dark:focus:bg-slate-750 text-sm text-slate-900 dark:text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-amber-400 dark:focus:border-amber-400 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                Pour recevoir la confirmation de commande et votre reçu.
              </span>
            </div>
          </div>
        </div>

        {/* Error notification if validation fails */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs font-semibold animate-shake">
            {errorMessage}
          </div>
        )}

        {/* Bottom Checkout CTA Summary */}
        <div className="bg-slate-900 dark:bg-slate-850 text-white rounded-3xl p-5 shadow-xl space-y-4 border border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Pack sélectionné</span>
            <span className="font-bold text-white">
              {selectedPack?.name} ({game.name})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Région & ID</span>
            <span className="font-mono text-amber-400">
              {selectedRegion} · {playerId || 'Non renseigné'}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Total à payer</span>
              <span className="text-2xl font-black text-amber-400 font-display">
                {selectedPack ? formatPrice(selectedPack.priceXOF, selectedPack.priceXAF) : '0'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-slate-900" />
              <span>{isSubmitting ? 'Traitement...' : 'Confirmer le paiement'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* HOW TO FIND ID GUIDE MODAL */}
      {showIdHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col transition-colors">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Trouver mon ID</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{game.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowIdHelpModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Instructions détaillées :
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {game.idHelpGuide.instruction}
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 block">Exemple d'ID valide :</span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {game.idHelpGuide.sampleId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPlayerId(game.idHelpGuide.sampleId);
                    setShowIdHelpModal(false);
                  }}
                  className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400"
                >
                  Utiliser l'exemple
                </button>
              </div>

              {/* Direct WhatsApp Customer Service Link as requested in Section 4 */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    openWhatsAppSupport(`Bonjour LUXSPAY, j'ai besoin d'aide pour trouver mon ID sur le jeu ${game.name}.`);
                    setShowIdHelpModal(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Demander de l'aide sur WhatsApp LUXSPAY</span>
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowIdHelpModal(false)}
                className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
