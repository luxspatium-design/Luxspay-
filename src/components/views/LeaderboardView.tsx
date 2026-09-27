import React, { useState, useMemo } from 'react';
import {
  Crown,
  Filter,
  Globe,
  Medal,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { COUNTRIES, GAMES } from '../../data/mockData';
import { GameId } from '../../types';
import { useApp } from '../../context/AppContext';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, currency, formatPrice } = useApp();

  type LeaderboardType = 'global' | 'jeu' | 'regional';
  const [rankingType, setRankingType] = useState<LeaderboardType>('global');

  // Filter options
  const [selectedGameFilter, setSelectedGameFilter] = useState<GameId>('free-fire');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('CI');

  // Compute filtered list
  const filteredList = useMemo(() => {
    let list = [...leaderboard];

    if (rankingType === 'jeu') {
      list = list.filter((item) => !item.gameId || item.gameId === selectedGameFilter);
    } else if (rankingType === 'regional') {
      list = list.filter((item) => !item.countryCode || item.countryCode === selectedCountryFilter);
    }

    // Sort by total spent descending
    list.sort((a, b) => b.totalSpentXOF - a.totalSpentXOF);

    // Re-index ranks
    return list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [leaderboard, rankingType, selectedGameFilter, selectedCountryFilter]);

  const top3 = filteredList.slice(0, 3);
  const others = filteredList.slice(3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-amber-400/30">
          <Crown className="w-4 h-4 fill-current" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-sm">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-800 flex items-center justify-center font-black text-sm">
          3
        </div>
      );
    }
    return (
      <span className="w-7 text-center font-mono font-bold text-slate-400 text-xs">
        #{rank}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24 md:pb-12 space-y-6">
      {/* Title */}
      <div className="text-center max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full mb-2 border border-transparent dark:border-amber-800/40">
          <Trophy className="w-3.5 h-3.5" />
          Panthéon des Joueurs LUXSPAY
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
          Classement Officiel
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Comptabilise en temps réel les recharges et jetons cumulés par la communauté.
        </p>
      </div>

      {/* 3 Main Ranking Type Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => setRankingType('global')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            rankingType === 'global'
              ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Global
        </button>

        <button
          onClick={() => setRankingType('jeu')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            rankingType === 'jeu'
              ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Par Jeu
        </button>

        <button
          onClick={() => setRankingType('regional')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            rankingType === 'regional'
              ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Régional
        </button>
      </div>

      {/* Sub-Filters: Per-Game Dropdown or Regional Dropdown */}
      {rankingType === 'jeu' && (
        <div className="flex items-center justify-center gap-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Jeu :</label>
          <select
            value={selectedGameFilter}
            onChange={(e) => setSelectedGameFilter(e.target.value as GameId)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:border-amber-400 focus:outline-none shadow-xs"
          >
            {GAMES.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {rankingType === 'regional' && (
        <div className="flex items-center justify-center gap-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Pays :</label>
          <select
            value={selectedCountryFilter}
            onChange={(e) => setSelectedCountryFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:border-amber-400 focus:outline-none shadow-xs"
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name} ({country.currency})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* TOP 3 PODIUM */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2 max-w-lg mx-auto">
          {/* #2 Rank (Left) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col items-center text-center order-1 h-44 sm:h-48 justify-between transition-colors">
            <div className="relative">
              <img
                src={top3[1].avatar}
                alt={top3[1].pseudo}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                2
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[90px]">
                {top3[1].pseudo}
              </h4>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Niv. {top3[1].level}</span>
            </div>
            <div className="w-full pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-black text-slate-900 dark:text-white block font-display">
                {formatPrice(top3[1].totalSpentXOF, top3[1].totalSpentXOF)}
              </span>
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold">
                {top3[1].totalTokens.toLocaleString('fr-FR')} jetons
              </span>
            </div>
          </div>

          {/* #1 Rank (Center, Highest) */}
          <div className="bg-gradient-to-b from-amber-400/20 via-white to-white dark:via-slate-900 dark:to-slate-900 rounded-3xl p-3 sm:p-4 border-2 border-amber-400 shadow-md flex flex-col items-center text-center order-2 h-52 sm:h-56 justify-between relative transition-colors">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider flex items-center gap-1 shadow-sm">
                <Crown className="w-3 h-3 fill-current" /> CHAMPION
              </div>
            </div>

            <div className="relative mt-2">
              <img
                src={top3[0].avatar}
                alt={top3[0].pseudo}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-400 shadow-md ring-4 ring-amber-100 dark:ring-amber-950/40"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 text-slate-950 text-xs font-black rounded-full flex items-center justify-center shadow-xs">
                1
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-xs sm:text-base text-slate-900 dark:text-white truncate max-w-[110px]">
                {top3[0].pseudo}
              </h4>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block">
                {top3[0].badgeTitle || 'Légende LUXS'}
              </span>
            </div>

            <div className="w-full pt-1.5 border-t border-amber-200/60 dark:border-amber-800/40">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white block font-display">
                {formatPrice(top3[0].totalSpentXOF, top3[0].totalSpentXOF)}
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                {top3[0].totalTokens.toLocaleString('fr-FR')} jetons
              </span>
            </div>
          </div>

          {/* #3 Rank (Right) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col items-center text-center order-3 h-40 sm:h-44 justify-between transition-colors">
            <div className="relative">
              <img
                src={top3[2].avatar}
                alt={top3[2].pseudo}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-700/30 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                3
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[90px]">
                {top3[2].pseudo}
              </h4>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Niv. {top3[2].level}</span>
            </div>
            <div className="w-full pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-black text-slate-900 dark:text-white block font-display">
                {formatPrice(top3[2].totalSpentXOF, top3[2].totalSpentXOF)}
              </span>
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold">
                {top3[2].totalTokens.toLocaleString('fr-FR')} jetons
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED LEADERBOARD LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500">
          <span>Position & Joueur</span>
          <span>Volume & Jetons</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredList.map((entry) => {
            const formattedTotal = formatPrice(entry.totalSpentXOF, entry.totalSpentXOF);

            return (
              <div
                key={entry.rank}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                  entry.rank <= 3 ? 'bg-amber-50/20 dark:bg-amber-950/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {/* Left: Position & Avatar & Pseudo */}
                <div className="flex items-center gap-3">
                  {getRankBadge(entry.rank)}

                  <img
                    src={entry.avatar}
                    alt={entry.pseudo}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{entry.pseudo}</span>
                      {entry.badgeTitle && (
                        <span className="hidden sm:inline text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded border border-amber-200/40 dark:border-amber-800/40">
                          {entry.badgeTitle}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      <span>Niveau {entry.level}</span>
                      {entry.countryCode && (
                        <>
                          <span>·</span>
                          <span>
                            {COUNTRIES.find((c) => c.code === entry.countryCode)?.flag}{' '}
                            {COUNTRIES.find((c) => c.code === entry.countryCode)?.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Total spent and tokens */}
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white block font-display">
                    {formattedTotal}
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold block">
                    {entry.totalTokens.toLocaleString('fr-FR')} jetons
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        Note : Les adresses e-mail et informations personnelles restent strictement confidentielles et ne sont jamais affichées.
      </div>
    </div>
  );
};
