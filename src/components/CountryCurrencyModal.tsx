import React, { useState } from 'react';
import { Check, Globe, X } from 'lucide-react';
import { COUNTRIES } from '../data/mockData';
import { Currency } from '../types';
import { useApp } from '../context/AppContext';

export const CountryCurrencyModal: React.FC = () => {
  const {
    isCountryModalOpen,
    setIsCountryModalOpen,
    selectedCountry,
    setSelectedCountry,
    currency,
    setCurrency,
  } = useApp();

  const [activeZone, setActiveZone] = useState<'ALL' | 'XOF' | 'XAF'>('ALL');

  if (!isCountryModalOpen) return null;

  const filteredCountries = COUNTRIES.filter((c) => {
    if (activeZone === 'ALL') return true;
    return c.currency === activeZone;
  });

  const handleSelectCountry = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsCountryModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Pays et Devise</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">13 pays d'Afrique disponibles avec paiement local</p>
            </div>
          </div>
          <button
            onClick={() => setIsCountryModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Switcher Section */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">Devise active :</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setCurrency('XOF')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                currency === 'XOF'
                  ? 'bg-amber-400/20 border-amber-400 text-slate-950 dark:text-amber-300 font-bold ring-1 ring-amber-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">XOF</span>
                {currency === 'XOF' && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal block mt-0.5">
                Franc CFA Afrique de l'Ouest
              </span>
            </button>

            <button
              onClick={() => setCurrency('XAF')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                currency === 'XAF'
                  ? 'bg-amber-400/20 border-amber-400 text-slate-950 dark:text-amber-300 font-bold ring-1 ring-amber-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">XAF</span>
                {currency === 'XAF' && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal block mt-0.5">
                Franc CFA Afrique centrale
              </span>
            </button>
          </div>
        </div>

        {/* Regional Filter Tabs */}
        <div className="px-5 pt-3 flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveZone('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeZone === 'ALL'
                ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Tous les pays (13)
          </button>
          <button
            onClick={() => setActiveZone('XOF')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeZone === 'XOF'
                ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Zone XOF (7)
          </button>
          <button
            onClick={() => setActiveZone('XAF')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeZone === 'XAF'
                ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Zone XAF (6)
          </button>
        </div>

        {/* Countries List */}
        <div className="p-4 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 space-y-1">
          {filteredCountries.map((country) => {
            const isSelected = selectedCountry.code === country.code;
            return (
              <button
                key={country.code}
                onClick={() => handleSelectCountry(country)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 dark:bg-amber-500/20 text-slate-950 dark:text-white font-semibold ring-1 ring-amber-400'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">{country.flag}</span>
                  <div className="text-left">
                    <div className="text-sm font-bold flex items-center gap-2">
                      <span className="text-slate-900 dark:text-white">{country.name}</span>
                      <span className="text-xs font-normal text-slate-400 dark:text-slate-500 font-mono">
                        {country.dialCode}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {country.paymentMethods.join(' · ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                    {country.currency}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Les moyens de paiement et les prix s'adaptent instantanément à votre pays.
          </p>
        </div>
      </div>
    </div>
  );
};
