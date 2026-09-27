import React, { useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Gamepad2,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HelpContactModal: React.FC = () => {
  const { isHelpModalOpen, setIsHelpModalOpen, openWhatsAppSupport, adminConfig } = useApp();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!isHelpModalOpen) return null;

  const faqs = [
    {
      q: 'Combien de temps prend la livraison des jetons/diamants ?',
      a: 'La livraison sur LUXSPAY est 100% instantanée et automatisée. Dès la confirmation de votre paiement Mobile Money (Orange, MTN, Wave, Moov), les jetons sont crédités sur votre ID en moins de 60 secondes.',
    },
    {
      q: 'Ai-je besoin de donner mon mot de passe de compte ?',
      a: 'JAMAIS ! LUXSPAY fonctionne par recharge directe sur ID de joueur officiel. Vous ne devez jamais communiquer vos identifiants de connexion ou mot de passe à qui que ce soit.',
    },
    {
      q: 'Comment trouver mon ID de joueur ?',
      a: 'Dans chaque jeu (Free Fire, COD Mobile, PUBG...), ouvrez votre profil joueur depuis le coin supérieur gauche. Votre ID numérique de compte y est affiché avec une icône de copie.',
    },
    {
      q: 'Que faire en cas de problème de débit sans réception ?',
      a: 'Notre service client WhatsApp est disponible 7j/7 pour vous assister. Cliquez sur « Problème avec une recharge » ci-dessous pour transmettre automatiquement votre numéro de transaction.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Aide & Service Client</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Support réactif WhatsApp 7j/7</p>
            </div>
          </div>
          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* WhatsApp Direct Hero Button */}
          <div className="p-5 bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white rounded-2xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Support WhatsApp Officiel
              </span>
              <span className="text-xs flex items-center gap-1 font-semibold text-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                En ligne maintenant
              </span>
            </div>

            <div>
              <h4 className="text-lg font-black font-display">Service Client WhatsApp</h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                Une équipe dédiée vous répond pour toute assistance de commande ou recharge.
              </p>
            </div>

            <button
              onClick={() => openWhatsAppSupport("Bonjour LUXSPAY, j'ai besoin d'une assistance immédiate.")}
              className="w-full py-3 bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Ouvrir la discussion WhatsApp</span>
            </button>
          </div>

          {/* 3 Quick Issue Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Signaler un problème spécifique :
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() =>
                  openWhatsAppSupport("Bonjour LUXSPAY, je signale un PROBLÈME AVEC UNE COMMANDE passée sur le site.")
                }
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-400 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Problème avec une commande</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Commande en attente ou non reçue</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">WhatsApp →</span>
              </button>

              <button
                onClick={() =>
                  openWhatsAppSupport("Bonjour LUXSPAY, je rencontre un PROBLÈME AVEC UNE RECHARGE de jetons/ID joueur.")
                }
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-400 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Gamepad2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Problème avec une recharge</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Erreur d'ID joueur ou de serveur</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">WhatsApp →</span>
              </button>

              <button
                onClick={() =>
                  openWhatsAppSupport("Bonjour LUXSPAY, j'ai rencontré un PROBLÈME DE PAIEMENT avec mon opérateur Mobile Money.")
                }
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-400 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Problème de paiement</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Échec Orange Money, Wave ou MTN</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">WhatsApp →</span>
              </button>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Foire Aux Questions (FAQ) :
            </span>

            <div className="space-y-2">
              {faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div
                    key={i}
                    className="border border-slate-200/80 dark:border-slate-700/80 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-left flex items-center justify-between gap-2 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 bg-white dark:bg-slate-850 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-750">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            LUXSPAY s'engage à assurer 100% de satisfaction sur chaque transaction.
          </p>
        </div>
      </div>
    </div>
  );
};
