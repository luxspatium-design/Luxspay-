import React from 'react';
import { Heart, ShoppingBag, Trash2, Zap } from 'lucide-react';
import { GAMES } from '../../data/mockData';
import { Game } from '../../types';
import { useApp } from '../../context/AppContext';

export const FavoritesView: React.FC = () => {
  const { favorites, toggleFavorite, setSelectedGame, setActiveTab, formatPrice } = useApp();

  const favoriteGames = GAMES.filter((g) => favorites.includes(g.id));

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 pb-24 md:pb-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
            <span>Mes Jeux Favoris</span>
            <Heart className="w-5 h-5 fill-amber-500 text-amber-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Accédez en 1 clic à vos jeux favoris pour une recharge express
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 rounded-full">
          {favoriteGames.length} jeu{favoriteGames.length > 1 ? 'x' : ''}
        </span>
      </div>

      {favoriteGames.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto my-8 space-y-3 transition-colors duration-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Aucun jeu dans vos favoris</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Ajoutez vos jeux préférés à votre liste de favoris en appuyant sur l'icône de cœur sur la fiche du jeu.
          </p>
          <button
            onClick={() => setActiveTab('boutique')}
            className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            Découvrir la Boutique
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {favoriteGames.map((game) => {
            const lowestPack = game.packs[0];
            const priceStr = formatPrice(lowestPack.priceXOF, lowestPack.priceXAF);

            return (
              <div
                key={game.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-400/80 hover:shadow-md transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{game.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{game.tokenName}</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Dès {priceStr}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => handleSelectGame(game)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
                  >
                    Recharger
                  </button>

                  <button
                    onClick={() => toggleFavorite(game.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                    title="Retirer des favoris"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
