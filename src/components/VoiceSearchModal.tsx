import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Search, Sparkles, Volume2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSearch: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSearch,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { addSearchHistory } = useApp();

  const suggestedVoiceQueries = [
    'Recharger Free Fire 520 Diamants',
    'Call of Duty Mobile Points CP',
    'PUBG Mobile 325 UC',
    'Pass Combat Free Fire',
    'Blood Strike Or',
  ];

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      return;
    }

    // Try starting speech recognition if supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    let recognition: any = null;

    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        setIsListening(false);
      }
    } else {
      // Emulate listening animation for 2.5 seconds
      setIsListening(true);
      const timer = setTimeout(() => {
        setIsListening(false);
      }, 3500);
      return () => clearTimeout(timer);
    }

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValidateTranscript = (textToUse: string) => {
    const query = textToUse || transcript;
    if (query.trim()) {
      addSearchHistory(query.trim());
      onSelectSearch(query.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center relative overflow-hidden transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mt-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-transparent dark:border-amber-800/40">
            Recherche Vocale LUXSPAY
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Dites le nom d'un jeu ou pack</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Exemple : « Free Fire » ou « COD Mobile »</p>
        </div>

        {/* Animated Microphone Target */}
        <div className="my-6 relative flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute w-32 h-32 rounded-full bg-amber-400/20 animate-ping" />
              <div className="absolute w-24 h-24 rounded-full bg-amber-400/40 animate-pulse" />
            </>
          )}
          <button
            onClick={() => setIsListening(!isListening)}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-slate-950 transition-transform active:scale-95 ${
              isListening
                ? 'bg-amber-500 shadow-xl shadow-amber-500/40 ring-4 ring-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-400/20 hover:text-amber-600'
            }`}
          >
            {isListening ? <Mic className="w-9 h-9" /> : <MicOff className="w-9 h-9" />}
          </button>
        </div>

        {/* Live speech transcription text box */}
        <div className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 min-h-[70px] flex items-center justify-center mb-4">
          {transcript ? (
            <p className="text-base font-semibold text-slate-900 dark:text-white animate-in fade-in">
              « {transcript} »
            </p>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500 italic flex items-center gap-2">
              <Volume2 className="w-4 h-4 animate-bounce text-amber-500" />
              {isListening ? 'À votre écoute, parlez maintenant...' : 'Micro en pause. Touchez pour parler.'}
            </p>
          )}
        </div>

        {/* Validate button if speech was detected */}
        {transcript && (
          <button
            onClick={() => handleValidateTranscript(transcript)}
            className="w-full mb-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Rechercher « {transcript} »</span>
          </button>
        )}

        {/* Suggestion Chips */}
        <div className="w-full text-left pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-2">
            Ou appuyez directement sur un exemple :
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedVoiceQueries.map((query, i) => (
              <button
                key={i}
                onClick={() => handleValidateTranscript(query)}
                className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-slate-700 dark:hover:text-amber-300 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>{query}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
