import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  Flame,
  Heart,
  History,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { GAMES, HERO_BANNER_IMAGE } from '../../data/mockData';
import { Game, GameId } from '../../types';
import { useApp } from '../../context/AppContext';

export const ShopView: React.FC = () => {
  const {
    setSelectedGame,
    currency,
    formatPrice,
    searchQuery,
    setSearchQuery,
    searchHistory,
    clearSearchHistory,
    isFavorite,
    toggleFavorite,
    adminConfig,
  } = useApp();

  type ShopCategory = 'accueil' | 'offres' | 'populaires' | 'nouveautes';
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('accueil');

  // Filtered games based on search query
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return GAMES;
    const q = searchQuery.toLowerCase().trim();
    return GAMES.filter(
      (game) =>
        game.name.toLowerCase().includes(q) ||
        game.tokenName.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Section subsets
  const bestOffersGames = useMemo(() => GAMES.filter((g) => g.isBestOffer || g.discountBadge), []);
  const popularGames = useMemo(() => GAMES.filter((g) => g.isPopular), []);
  const newGames = useMemo(() => GAMES.filter((g) => g.isNew), []);

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 pb-24 md:pb-12 space-y-6">
      {/* Category Pills Header Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveCategory('accueil')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'accueil'
              ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Accueil</span>
        </button>

        <button
          onClick={() => setActiveCategory('offres')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'offres'
              ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Meilleures offres</span>
        </button>

        <button
          onClick={() => setActiveCategory('populaires')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'populaires'
              ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Jeux les plus populaires</span>
        </button>

        <button
          onClick={() => setActiveCategory('nouveautes')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'nouveautes'
              ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span>Nouveautés LUXSPAY</span>
        </button>
      </div>

      {/* Active Search Results Overlay / Mode */}
      {searchQuery.trim() !== '' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Résultats pour « <span className="text-amber-600 dark:text-amber-400">{searchQuery}</span> » ({filteredGames.length})
            </h2>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
            >
              Effacer la recherche
            </button>
          </div>

          {filteredGames.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Aucun résultat trouvé</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Aucun jeu ne correspond à votre recherche. Vérifiez l'orthographe ou découvrez nos 14 jeux disponibles.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs hover:bg-amber-400 active:scale-95"
              >
                Voir tout le catalogue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} onSelect={() => handleSelectGame(game)} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Recent searches history chips if any */}
          {searchHistory.length > 0 && activeCategory === 'accueil' && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0">
                <History className="w-3 h-3" /> Récents :
              </span>
              {searchHistory.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(item)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-amber-300 text-slate-600 dark:text-slate-300 rounded-lg whitespace-nowrap transition-colors"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={clearSearchHistory}
                className="text-[10px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 shrink-0 ml-1 underline"
                title="Effacer l'historique"
              >
                Effacer
              </button>
            </div>
          )}

          {/* LARGE PROMOTIONAL BANNER */}
          {(activeCategory === 'accueil' || activeCategory === 'offres') && (
            <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 dark:border-slate-800 bg-slate-950">
              <div className="relative h-48 sm:h-64 w-full">
                <img
                  src={HERO_BANNER_IMAGE}
                  alt="LUXSPAY Promo"
                  className="w-full h-full object-cover object-center opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />

                {/* Banner Content */}
                <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-between max-w-lg">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Plateforme N°1 en Afrique
                    </span>
                    <h1 className="text-xl sm:text-3xl font-black text-white font-display mt-2 sm:mt-3 leading-tight">
                      « {adminConfig.promoText} »
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2">
                      Rechargez Free Fire, COD Mobile, PUBG instantanément avec Orange Money, MTN, Moov et Wave.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleSelectGame(GAMES[0])}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center gap-1.5"
                    >
                      <span>Recharger Free Fire</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveCategory('offres')}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-sm transition-all"
                    >
                      Toutes les offres
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: MEILLEURES OFFRES */}
          {(activeCategory === 'accueil' || activeCategory === 'offres') && (
            <section className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                    <span>Meilleures offres</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Les recharges avec le plus fort bonus du moment</p>
                </div>
                {activeCategory === 'accueil' && (
                  <button
                    onClick={() => setActiveCategory('offres')}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-0.5"
                  >
                    <span>Voir tout</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Horizontal Scroll / Grid of Best Offers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {bestOffersGames.slice(0, 3).map((game) => {
                  const lowestPack = game.packs[0];
                  const priceStr = formatPrice(lowestPack.priceXOF, lowestPack.priceXAF);
                  const favorited = isFavorite(game.id);

                  return (
                    <div
                      key={game.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-400/80 hover:shadow-md transition-all flex gap-3.5 items-center relative group"
                    >
                      {/* Game Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                        <img
                          src={game.image}
                          alt={game.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {game.discountBadge && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                            {game.discountBadge}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{game.name}</h3>
                          <button
                            onClick={() => toggleFavorite(game.id)}
                            className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                favorited ? 'fill-amber-500 text-amber-500' : ''
                              }`}
                            />
                          </button>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Monnaie : <strong className="text-slate-700 dark:text-slate-300">{game.tokenName}</strong>
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-tight">À partir de</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white font-display">
                              {priceStr}
                            </span>
                          </div>

                          <button
                            onClick={() => handleSelectGame(game)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
                          >
                            Recharger
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SECTION: JEUX LES PLUS POPULAIRES */}
          {(activeCategory === 'accueil' || activeCategory === 'populaires') && (
            <section className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                    <span>Jeux les plus populaires</span>
                    <Flame className="w-4 h-4 text-amber-500" />
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Les titres les plus joués en Afrique de l'Ouest et Centrale</p>
                </div>
                {activeCategory === 'accueil' && (
                  <button
                    onClick={() => setActiveCategory('populaires')}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-0.5"
                  >
                    <span>Voir tout</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Grid of popular games */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {(activeCategory === 'populaires' ? popularGames : popularGames.slice(0, 8)).map(
                  (game) => (
                    <GameCard key={game.id} game={game} onSelect={() => handleSelectGame(game)} />
                  )
                )}
              </div>
            </section>
          )}

          {/* SECTION: NOUVEAUTÉS LUXSPAY */}
          {(activeCategory === 'accueil' || activeCategory === 'nouveautes') && (
            <section className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                    <span>Nouveautés LUXSPAY</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Nouveaux jeux et services de recharge ajoutés</p>
                </div>
              </div>

              {/* Grid of new games */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {newGames.map((game) => (
                  <GameCard key={game.id} game={game} onSelect={() => handleSelectGame(game)} />
                ))}
              </div>
            </section>
          )}

          {/* CATALOGUE COMPLET (if on 'accueil' or viewing all 14 games) */}
          {activeCategory === 'accueil' && (
            <section className="space-y-3 pt-6 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
                    Tous les 14 jeux disponibles
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Catalogue complet vérifié et garanti instantané</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300">
                  14 jeux
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {GAMES.map((game) => (
                  <GameCard key={game.id} game={game} onSelect={() => handleSelectGame(game)} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

// Reusable Game Card Component
interface GameCardProps {
  game: Game;
  onSelect: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  const { formatPrice, isFavorite, toggleFavorite } = useApp();
  const lowestPack = game.packs[0];
  const priceStr = formatPrice(lowestPack.priceXOF, lowestPack.priceXAF);
  const favorited = isFavorite(game.id);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:border-amber-400 dark:hover:border-amber-400/80 hover:shadow-md transition-all flex flex-col justify-between group">
      {/* Top Image Banner */}
      <div className="relative h-28 sm:h-36 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(game.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm transition-all active:scale-90"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              favorited ? 'fill-amber-500 text-amber-500' : 'text-slate-600 dark:text-slate-300'
            }`}
          />
        </button>

        {/* Badge */}
        {game.discountBadge && (
          <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-tight bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
            {game.discountBadge}
          </span>
        )}

        {/* Monnaie on card bottom */}
        <span className="absolute bottom-2 left-2 text-[10px] font-bold text-amber-300 drop-shadow-sm">
          {game.tokenName}
        </span>
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
            {game.name}
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Dès <span className="font-bold text-slate-700 dark:text-slate-300">{priceStr}</span>
          </p>
        </div>

        <button
          onClick={onSelect}
          className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-xs"
        >
          Recharger
        </button>
      </div>
    </div>
  );
};
