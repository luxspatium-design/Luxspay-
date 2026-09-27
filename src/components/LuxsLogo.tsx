import React from 'react';

interface LuxsLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  showTagline?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
  isDark?: boolean;
  useImage?: boolean;
}

const EMBLEM_IMG = '/src/assets/images/luxspay_emblem_symbol_1790499952908.jpg';
const FULL_LOGO_IMG = '/src/assets/images/luxspay_official_logo_1790499936201.jpg';

export const LuxsLogo: React.FC<LuxsLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  layout = 'horizontal',
  className = '',
  isDark,
  useImage = false,
}) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
  };

  const textSizes = {
    xs: 'text-sm tracking-tight',
    sm: 'text-base sm:text-lg tracking-tight',
    md: 'text-xl sm:text-2xl tracking-tight',
    lg: 'text-2xl sm:text-3xl tracking-tight',
    xl: 'text-3xl sm:text-4xl tracking-normal',
    '2xl': 'text-5xl sm:text-6xl tracking-normal',
  };

  const isVertical = layout === 'vertical';

  return (
    <div
      className={`inline-flex ${
        isVertical ? 'flex-col items-center text-center gap-3' : 'items-center gap-2.5'
      } select-none ${className}`}
    >
      {/* Official LUXSPAY Emblem: 3D Golden L with Energy Orbit & Game Controller */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        {useImage ? (
          <img
            src={EMBLEM_IMG}
            alt="LUXSPAY"
            className="w-full h-full object-contain rounded-2xl drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Vibrant Gold Gradients */}
              <linearGradient id="luxsGoldPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="15%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="luxsGoldFacet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="60%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>

              <linearGradient id="luxsOrbitGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="45%" stopColor="#FDE047" />
                <stop offset="80%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="luxsPadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#FACC15" />
                <stop offset="90%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#F59E0B" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Back orbital swoosh behind L */}
            <path
              d="M 52 38 C 58 29 68 28 72 29"
              stroke="url(#luxsOrbitGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Main 3D Stylized Golden 'L' */}
            <g filter="url(#goldGlow)">
              {/* Beveled 3D Side/Depth of vertical stem */}
              <polygon
                points="34,22 47,15 47,60 34,67"
                fill="url(#luxsGoldFacet)"
              />
              {/* Front Face of vertical stem */}
              <polygon
                points="34,22 45,15 54,15 45,67 34,67"
                fill="url(#luxsGoldPrimary)"
              />
              {/* Sharp top-left notch on L */}
              <polygon
                points="34,22 42,32 42,42 34,48"
                fill="url(#luxsGoldFacet)"
                opacity="0.9"
              />

              {/* Bottom horizontal base of L */}
              <polygon
                points="34,67 74,67 65,77 34,77"
                fill="url(#luxsGoldFacet)"
              />
              <polygon
                points="34,60 72,60 74,67 34,67"
                fill="url(#luxsGoldPrimary)"
              />
            </g>

            {/* Front Orbital Golden Swoosh looping around and extending to controller */}
            <path
              d="M 24 53 C 21 68 34 82 52 79 C 64 77 74 68 80 50 C 83 41 81 33 76 31"
              stroke="url(#luxsOrbitGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Trailing energy tail for swoosh */}
            <path
              d="M 28 48 C 24 58 28 74 44 79"
              stroke="#FDE047"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Floating Golden Game Controller / Gamepad on top-right */}
            <g transform="translate(62, 18) rotate(16)">
              {/* Controller Main Body */}
              <rect
                x="0"
                y="0"
                width="24"
                height="15"
                rx="6"
                fill="url(#luxsPadGrad)"
                stroke="#CA8A04"
                strokeWidth="0.8"
                className="drop-shadow-sm"
              />
              {/* Left Grip */}
              <ellipse cx="4" cy="14" rx="4" ry="5" fill="url(#luxsPadGrad)" stroke="#CA8A04" strokeWidth="0.6" />
              {/* Right Grip */}
              <ellipse cx="20" cy="14" rx="4" ry="5" fill="url(#luxsPadGrad)" stroke="#CA8A04" strokeWidth="0.6" />

              {/* D-Pad on Left */}
              <rect x="4.5" y="4" width="2" height="6" rx="0.5" fill="#1E293B" />
              <rect x="2.5" y="6" width="6" height="2" rx="0.5" fill="#1E293B" />

              {/* Action Buttons on Right */}
              <circle cx="17.5" cy="4.5" r="1" fill="#0F172A" />
              <circle cx="19.5" cy="6.5" r="1" fill="#0F172A" />
              <circle cx="15.5" cy="6.5" r="1" fill="#0F172A" />
              <circle cx="17.5" cy="8.5" r="1" fill="#0F172A" />

              {/* Center Accent / Status LED */}
              <circle cx="11" cy="7" r="0.8" fill="#F59E0B" />
            </g>

            {/* Gleam Sparkle on top corner of L */}
            <circle cx="45" cy="16" r="2.2" fill="#FFFFFF" opacity="0.9" />
          </svg>
        )}
      </div>

      {/* Typography: LUX in Black, SPAY in Vibrant Metallic Gold */}
      {showText && (
        <div className={`flex flex-col ${isVertical ? 'items-center' : 'items-start'} leading-none`}>
          <div className="flex items-center tracking-tight">
            {/* LUX: Deep black in light mode, crisp white in dark mode */}
            <span
              className={`font-display font-black ${textSizes[size]} transition-colors ${
                isDark !== undefined
                  ? isDark
                    ? 'text-white'
                    : 'text-slate-950'
                  : 'text-slate-950 dark:text-white'
              }`}
            >
              LUX
            </span>
            {/* SPAY: Rich golden amber gradient with subtle shadow */}
            <span
              className={`font-display font-black ${textSizes[size]} bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-xs`}
            >
              SPAY
            </span>
          </div>

          {showTagline ? (
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-normal mt-1">
              Rechargez • Jouez • Gagnez
            </span>
          ) : (
            <span className="text-[9px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              Recharge Jeux Vidéo
            </span>
          )}
        </div>
      )}
    </div>
  );
};
