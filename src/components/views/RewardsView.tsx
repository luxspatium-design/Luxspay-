import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Gift,
  Lock,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RewardsView: React.FC = () => {
  const { rewards, claimReward, setActiveTab } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24 md:pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full mb-1 border border-transparent dark:border-amber-800/40">
            <Gift className="w-3.5 h-3.5" />
            Programme Fidélité & Drops
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            Récompenses & Bonus
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Débloquez des bonus exclusifs, passes de combat et statuts VIP selon vos recharges.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('classement')}
          className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Voir le Classement</span>
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rewards.map((reward) => {
          const isClaimed = reward.status === 'Réclamée';
          const isAvailable = reward.status === 'Disponible';
          const percent = Math.min(
            100,
            Math.round((reward.progressCurrent / reward.progressTarget) * 100)
          );

          return (
            <div
              key={reward.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                isAvailable
                  ? 'border-amber-400 ring-2 ring-amber-400/30'
                  : 'border-slate-200/90 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Reward Image Header */}
                <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={reward.image}
                    alt={reward.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Top Badge */}
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                    {reward.badge}
                  </span>

                  {/* Expiration date */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>Expire le {reward.expiresAt}</span>
                  </div>

                  {/* Title on image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-extrabold text-base text-white leading-tight">
                      {reward.title}
                    </h3>
                    <p className="text-xs text-amber-300 mt-0.5">{reward.subtitle}</p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Condition d'obtention :
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {reward.condition}
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
                    <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                      Gain exclusif :
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {reward.rewardValue}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>Progression</span>
                      <span>
                        {reward.progressCurrent.toLocaleString('fr-FR')} /{' '}
                        {reward.progressTarget.toLocaleString('fr-FR')} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                {isClaimed ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Récompense déjà réclamée</span>
                  </button>
                ) : isAvailable ? (
                  <button
                    onClick={() => claimReward(reward.id)}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Réclamer ma récompense</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('boutique')}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>Recharger pour débloquer</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-slate-100/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
        Durée par défaut de disponibilité des récompenses : <strong>3 mois</strong>. Modifiable par l'administrateur.
      </div>
    </div>
  );
};
