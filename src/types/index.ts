export type Currency = 'XOF' | 'XAF';

export type GameId =
  | 'free-fire'
  | 'cod-mobile'
  | 'pubg-mobile'
  | 'blood-strike'
  | 'farlight-84'
  | 'arena-breakout'
  | 'delta-force'
  | 'lords-mobile'
  | 'efootball'
  | 'mobile-legends'
  | 'honor-of-kings'
  | 'brawl-stars'
  | 'wuthering-waves'
  | 'genshin-impact';

export interface GamePack {
  id: string;
  name: string;
  tokensCount: number;
  bonusText?: string;
  priceXOF: number;
  priceXAF: number;
  isPopular?: boolean;
}

export interface Game {
  id: GameId;
  name: string;
  tokenName: string; // e.g. "Diamants", "Points CP", "UC", etc.
  category: 'battle-royale' | 'shooter' | 'moba' | 'rpg' | 'strategy' | 'sports';
  regions: string[];
  image: string;
  bannerImage: string;
  idHelpGuide: {
    instruction: string;
    sampleId: string;
  };
  packs: GamePack[];
  isPopular?: boolean;
  isNew?: boolean;
  isBestOffer?: boolean;
  discountBadge?: string;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  currency: Currency;
  paymentMethods: string[];
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  shortName: string;
  iconBg: string;
  textColor: string;
  availableCountries: string[];
}

export interface SavedPlayerId {
  id: string;
  gameId: GameId;
  playerId: string;
  serverRegion: string;
  label: string; // e.g. "Mon Compte Principal"
}

export interface Order {
  id: string; // e.g. "LX-2026-98124"
  gameId: GameId;
  gameName: string;
  gameImage: string;
  packName: string;
  tokensCount: number;
  tokenName: string;
  amount: number;
  currency: Currency;
  paymentMethod: string;
  playerPhone: string;
  playerEmail: string;
  playerId: string;
  serverRegion: string;
  date: string;
  time: string;
  status: 'Complétée' | 'En cours' | 'Échouée';
}

export interface LeaderboardEntry {
  rank: number;
  pseudo: string;
  avatar: string;
  totalSpentXOF: number;
  totalTokens: number;
  level: number;
  gameId?: GameId;
  countryCode?: string;
  badgeTitle?: string;
}

export interface Reward {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  condition: string;
  rewardValue: string;
  status: 'Disponible' | 'En cours' | 'Réclamée';
  progressCurrent: number;
  progressTarget: number;
  expiresAt: string;
  image: string;
}

export interface UserProfile {
  pseudo: string;
  email: string;
  phone?: string;
  avatar: string;
  level: number;
  vipTier: string;
  isLoggedIn: boolean;
  loginProvider?: 'google' | 'facebook' | 'apple' | 'email';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'promo' | 'reward';
}

export interface LocalToastNotification {
  id: string;
  orderId?: string;
  order?: Order;
  title: string;
  message: string;
  status: 'Complétée' | 'En cours' | 'Échouée';
  timestamp: number;
  duration?: number;
}
