import React, { createContext, useContext, useEffect, useState } from 'react';
import { COUNTRIES, GAMES, INITIAL_LEADERBOARD, INITIAL_REWARDS } from '../data/mockData';
import { Country, Currency, Game, GameId, LeaderboardEntry, LocalToastNotification, NotificationItem, Order, Reward, SavedPlayerId, UserProfile } from '../types';

export type ActiveTab = 'boutique' | 'favoris' | 'classement' | 'recompenses' | 'profil';

interface AdminConfig {
  whatsappNumber: string;
  promoText: string;
  rewardsDurationMonths: number;
  conversionRateXOFtoXAF: number; // 1 XOF = ? XAF (default 1.0)
  enableLiveRecharges: boolean;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;

  // Country & Currency
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceXOF: number, priceXAF: number) => string;

  // Favorites
  favorites: GameId[];
  toggleFavorite: (gameId: GameId) => void;
  isFavorite: (gameId: GameId) => boolean;

  // Saved IDs
  savedPlayerIds: SavedPlayerId[];
  savePlayerId: (gameId: GameId, playerId: string, serverRegion: string, label?: string) => void;
  removeSavedPlayerId: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'time' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: Order['status'], customMessage?: string) => void;
  simulateLiveStatusUpdate: (orderId?: string) => void;
  lastOrderSuccess: Order | null;
  setLastOrderSuccess: (order: Order | null) => void;
  selectedOrderForModal: Order | null;
  setSelectedOrderForModal: (order: Order | null) => void;

  // Real-time Push / Toast notifications
  toasts: LocalToastNotification[];
  showToast: (toast: Omit<LocalToastNotification, 'id' | 'timestamp'>) => void;
  dismissToast: (id: string) => void;

  // Theme & Dark Mode
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchHistory: string[];
  addSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;

  // User & Auth
  user: UserProfile;
  loginUser: (provider: 'google' | 'facebook' | 'apple' | 'email', pseudo?: string, email?: string, phone?: string) => void;
  logoutUser: () => void;

  // Leaderboard & Rewards
  leaderboard: LeaderboardEntry[];
  rewards: Reward[];
  claimReward: (rewardId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationsCount: number;

  // Modals & Panels
  isCountryModalOpen: boolean;
  setIsCountryModalOpen: (open: boolean) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  isNotificationsModalOpen: boolean;
  setIsNotificationsModalOpen: (open: boolean) => void;
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isSplashModalOpen: boolean;
  setIsSplashModalOpen: (open: boolean) => void;

  // Admin Config
  adminConfig: AdminConfig;
  updateAdminConfig: (newConfig: Partial<AdminConfig>) => void;

  // WhatsApp trigger helper
  openWhatsAppSupport: (customMessage?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('boutique');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Country & Currency: Default Côte d'Ivoire (CI - XOF)
  const [selectedCountry, setSelectedCountryState] = useState<Country>(() => {
    const saved = localStorage.getItem('luxs_country');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = COUNTRIES.find((c) => c.code === parsed.code);
        if (match) return match;
      } catch (e) {
        // fallback
      }
    }
    return COUNTRIES[0]; // Côte d'Ivoire
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('luxs_currency') as Currency;
    return saved === 'XAF' ? 'XAF' : 'XOF';
  });

  const setSelectedCountry = (country: Country) => {
    setSelectedCountryState(country);
    setCurrencyState(country.currency);
    localStorage.setItem('luxs_country', JSON.stringify(country));
    localStorage.setItem('luxs_currency', country.currency);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('luxs_currency', curr);
  };

  // Theme (Dark Mode)
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('luxs_theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('luxs_theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Synchronize theme class with documentElement and meta theme-color
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('luxs_theme', theme);

    // Meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0B0F19' : '#F59E0B');
    }
  }, [theme]);

  // Favorites
  const [favorites, setFavorites] = useState<GameId[]>(() => {
    const saved = localStorage.getItem('luxs_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return ['free-fire', 'cod-mobile', 'pubg-mobile'];
  });

  const toggleFavorite = (gameId: GameId) => {
    setFavorites((prev) => {
      const next = prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId];
      localStorage.setItem('luxs_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (gameId: GameId) => favorites.includes(gameId);

  // Saved IDs
  const [savedPlayerIds, setSavedPlayerIds] = useState<SavedPlayerId[]>(() => {
    const saved = localStorage.getItem('luxs_saved_ids');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      { id: 'save-1', gameId: 'free-fire', playerId: '2984719284', serverRegion: 'SSA — Sub-Saharan Africa', label: 'Compte Principal' },
      { id: 'save-2', gameId: 'cod-mobile', playerId: '674938201948291039', serverRegion: 'Afrique', label: 'Escouade Ranked' },
    ];
  });

  const savePlayerId = (gameId: GameId, playerId: string, serverRegion: string, label = 'Compte') => {
    const newEntry: SavedPlayerId = {
      id: `id-${Date.now()}`,
      gameId,
      playerId,
      serverRegion,
      label,
    };
    setSavedPlayerIds((prev) => {
      const filtered = prev.filter((item) => !(item.gameId === gameId && item.playerId === playerId));
      const next = [newEntry, ...filtered];
      localStorage.setItem('luxs_saved_ids', JSON.stringify(next));
      return next;
    });
  };

  const removeSavedPlayerId = (id: string) => {
    setSavedPlayerIds((prev) => {
      const next = prev.filter((item) => item.id !== id);
      localStorage.setItem('luxs_saved_ids', JSON.stringify(next));
      return next;
    });
  };

  // Orders History
  const [orders, setOrders] = useState<Order[]>(() => {
    const defaultOrders: Order[] = [
      {
        id: 'LX-2026-94812',
        gameId: 'free-fire',
        gameName: 'Free Fire',
        gameImage: GAMES[0]?.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
        packName: '520 + 52 Diamants',
        tokensCount: 572,
        tokenName: 'Diamants',
        amount: 3500,
        currency: 'XOF',
        paymentMethod: 'Wave',
        playerPhone: '+225 07 88 99 11',
        playerEmail: 'joueur.ci@gmail.com',
        playerId: '2984719284',
        serverRegion: 'SSA — Sub-Saharan Africa',
        date: '26 Sept 2026',
        time: '18:42',
        status: 'Complétée',
      },
      {
        id: 'LX-2026-93504',
        gameId: 'pubg-mobile',
        gameName: 'PUBG Mobile',
        gameImage: GAMES[2]?.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
        packName: '600 + 60 UC',
        tokensCount: 660,
        tokenName: 'UC',
        amount: 5800,
        currency: 'XOF',
        paymentMethod: 'MTN Mobile Money',
        playerPhone: '+225 05 99 11 22',
        playerEmail: 'joueur.ci@gmail.com',
        playerId: '5192847102',
        serverRegion: 'Global',
        date: '25 Sept 2026',
        time: '20:10',
        status: 'En cours',
      },
      {
        id: 'LX-2026-92140',
        gameId: 'cod-mobile',
        gameName: 'Call of Duty Mobile',
        gameImage: GAMES[1]?.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
        packName: '420 Points CP',
        tokensCount: 420,
        tokenName: 'Points CP',
        amount: 4100,
        currency: 'XOF',
        paymentMethod: 'Orange Money',
        playerPhone: '+225 05 44 22 10',
        playerEmail: 'joueur.ci@gmail.com',
        playerId: '674938201948291039',
        serverRegion: 'Afrique',
        date: '24 Sept 2026',
        time: '14:15',
        status: 'Complétée',
      },
      {
        id: 'LX-2026-91028',
        gameId: 'blood-strike',
        gameName: 'Blood Strike',
        gameImage: GAMES[3]?.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
        packName: '1 080 Or Blood Strike',
        tokensCount: 1080,
        tokenName: 'Or',
        amount: 6900,
        currency: 'XOF',
        paymentMethod: 'Moov Money',
        playerPhone: '+225 01 22 33 44',
        playerEmail: 'joueur.ci@gmail.com',
        playerId: '8910284711',
        serverRegion: 'Global',
        date: '22 Sept 2026',
        time: '09:30',
        status: 'Échouée',
      },
    ];

    const saved = localStorage.getItem('luxs_orders');
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        // If parsed exists and contains items with diverse statuses, use it
        const hasPendingOrFailed = parsed.some(
          (o) => o.status === 'En cours' || o.status === 'Échouée'
        );
        if (hasPendingOrFailed && parsed.length >= 3) {
          return parsed;
        }
        // Otherwise merge demo items so user has immediate visibility of success, pending, failed
        const existingIds = new Set(parsed.map((p) => p.id));
        const merged = [...parsed, ...defaultOrders.filter((d) => !existingIds.has(d.id))];
        localStorage.setItem('luxs_orders', JSON.stringify(merged));
        return merged;
      } catch (e) {
        // ignore
      }
    }
    localStorage.setItem('luxs_orders', JSON.stringify(defaultOrders));
    return defaultOrders;
  });

  const [lastOrderSuccess, setLastOrderSuccess] = useState<Order | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Local Push Notifications / Toasts state
  const [toasts, setToasts] = useState<LocalToastNotification[]>([]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (toastData: Omit<LocalToastNotification, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: LocalToastNotification = {
      ...toastData,
      id,
      timestamp: Date.now(),
      duration: toastData.duration ?? 6000,
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep max 4 toasts at once

    // Auto dismiss after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.duration);
    }
  };

  // Update order status with real-time push toast and sync with notifications
  const updateOrderStatus = (
    orderId: string,
    newStatus: Order['status'],
    customMessage?: string
  ) => {
    let targetOrder: Order | undefined;

    setOrders((prev) => {
      const next = prev.map((ord) => {
        if (ord.id === orderId) {
          targetOrder = { ...ord, status: newStatus };
          return targetOrder;
        }
        return ord;
      });
      localStorage.setItem('luxs_orders', JSON.stringify(next));
      return next;
    });

    if (targetOrder) {
      const order = targetOrder;
      // Title and Message according to status
      let toastTitle = '';
      let toastMessage = '';

      if (newStatus === 'Complétée') {
        toastTitle = `Recharge Validée ! (${order.gameName})`;
        toastMessage =
          customMessage ||
          `Votre commande ${order.id} de +${order.tokensCount.toLocaleString('fr-FR')} ${order.tokenName} a été créditée avec succès sur le compte ${order.playerId}.`;
      } else if (newStatus === 'En cours') {
        toastTitle = `Transaction En Attente (${order.gameName})`;
        toastMessage =
          customMessage ||
          `Votre commande ${order.id} est en cours de validation auprès de l'opérateur (${order.paymentMethod}).`;
      } else {
        toastTitle = `Échec de Recharge (${order.gameName})`;
        toastMessage =
          customMessage ||
          `La transaction ${order.id} n'a pas pu être débitée ou a été rejetée. Aucun frais n'a été prélevé.`;
      }

      // 1. Show immediate Push Toast
      showToast({
        orderId: order.id,
        order,
        title: toastTitle,
        message: toastMessage,
        status: newStatus,
        duration: 7000,
      });

      // 2. Also register in the permanent notifications center
      const notifItem: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: toastTitle,
        message: toastMessage,
        time: "À l'instant",
        isRead: false,
        type: 'order',
      };
      setNotifications((prev) => [notifItem, ...prev]);
    }
  };

  // Quick simulator for testing real-time status changes
  const simulateLiveStatusUpdate = (orderId?: string) => {
    // Find an order, prioritize 'En cours' or first available
    const target = orderId
      ? orders.find((o) => o.id === orderId)
      : orders.find((o) => o.status === 'En cours') || orders[0];

    if (!target) return;

    const possibleStatuses: Order['status'][] = ['Complétée', 'En cours', 'Échouée'];
    const currentIdx = possibleStatuses.indexOf(target.status);
    const nextStatus = possibleStatuses[(currentIdx + 1) % possibleStatuses.length];

    updateOrderStatus(target.id, nextStatus);
  };

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('luxs_search_history');
    return saved ? JSON.parse(saved) : ['Free Fire', 'COD Mobile', 'PUBG', 'Pass Combat'];
  });

  const addSearchHistory = (term: string) => {
    if (!term.trim()) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== term.toLowerCase());
      const next = [term.trim(), ...filtered].slice(0, 8);
      localStorage.setItem('luxs_search_history', JSON.stringify(next));
      return next;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('luxs_search_history');
  };

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('luxs_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      pseudo: 'Gamer_Abidjan',
      email: 'joueur.ci@gmail.com',
      phone: '+225 07 88 99 11',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      level: 16,
      vipTier: 'VIP Argent',
      isLoggedIn: true,
      loginProvider: 'google',
    };
  });

  const loginUser = (
    provider: 'google' | 'facebook' | 'apple' | 'email',
    pseudo = 'Joueur_LUXS',
    email = 'joueur@luxspay.com',
    phone?: string
  ) => {
    const updated: UserProfile = {
      pseudo,
      email,
      phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      level: user.level || 1,
      vipTier: 'VIP Bronze',
      isLoggedIn: true,
      loginProvider: provider,
    };
    setUser(updated);
    localStorage.setItem('luxs_user', JSON.stringify(updated));
  };

  const logoutUser = () => {
    const guest: UserProfile = {
      pseudo: 'Invité',
      email: '',
      avatar: '',
      level: 0,
      vipTier: 'Non connecté',
      isLoggedIn: false,
    };
    setUser(guest);
    localStorage.setItem('luxs_user', JSON.stringify(guest));
  };

  // Admin Config
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(() => {
    const saved = localStorage.getItem('luxs_admin_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      whatsappNumber: '2250700000000',
      promoText: 'Rechargez • Jouez • Gagnez',
      rewardsDurationMonths: 3,
      conversionRateXOFtoXAF: 1.0,
      enableLiveRecharges: true,
    };
  });

  const updateAdminConfig = (newConfig: Partial<AdminConfig>) => {
    setAdminConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('luxs_admin_config', JSON.stringify(updated));
      return updated;
    });
  };

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  // Rewards
  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('luxs_rewards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_REWARDS;
  });

  const claimReward = (rewardId: string) => {
    setRewards((prev) => {
      const next = prev.map((r) => (r.id === rewardId ? { ...r, status: 'Réclamée' as const } : r));
      localStorage.setItem('luxs_rewards', JSON.stringify(next));
      return next;
    });
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Commande validée !',
      message: 'Votre recharge de 520 Diamants Free Fire a été créditée avec succès.',
      time: 'Il y a 20 min',
      isRead: false,
      type: 'order',
    },
    {
      id: 'notif-2',
      title: 'Offre Spéciale LUXSPAY',
      message: '+15% de bonus sur toutes vos recharges via Wave et MTN Money ce week-end !',
      time: 'Il y a 2 heures',
      isRead: false,
      type: 'promo',
    },
    {
      id: 'notif-3',
      title: 'Nouvelle récompense disponible',
      message: 'Félicitations ! Vous avez débloqué le Bonus Royal +15% Diamants.',
      time: 'Hier',
      isRead: true,
      type: 'reward',
    },
  ]);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Create Order Handler
  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'time' | 'status'>): Order => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const orderId = `LX-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      date: dateStr,
      time: timeStr,
      status: 'Complétée',
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('luxs_orders', JSON.stringify(nextOrders));
    setLastOrderSuccess(newOrder);

    // Update notifications
    const notifTitle = `Recharge Validée ! (${newOrder.gameName})`;
    const notifMessage = `Votre recharge de ${newOrder.packName} a été créditée instantanément sur l'ID ${newOrder.playerId}.`;

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: notifTitle,
      message: notifMessage,
      time: "À l'instant",
      isRead: false,
      type: 'order',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Show Push Toast Notification
    showToast({
      orderId: newOrder.id,
      order: newOrder,
      title: notifTitle,
      message: notifMessage,
      status: 'Complétée',
      duration: 6000,
    });

    // Update Leaderboard dynamically
    setLeaderboard((prev) => {
      const existingUserEntryIndex = prev.findIndex((entry) => entry.pseudo === user.pseudo);
      const spentAmountInXOF = newOrder.currency === 'XOF' ? newOrder.amount : Math.round(newOrder.amount * (1 / adminConfig.conversionRateXOFtoXAF));

      let updatedList = [...prev];
      if (existingUserEntryIndex >= 0) {
        updatedList[existingUserEntryIndex] = {
          ...updatedList[existingUserEntryIndex],
          totalSpentXOF: updatedList[existingUserEntryIndex].totalSpentXOF + spentAmountInXOF,
          totalTokens: updatedList[existingUserEntryIndex].totalTokens + newOrder.tokensCount,
        };
      } else {
        updatedList.push({
          rank: prev.length + 1,
          pseudo: user.pseudo || 'Gamer_Abidjan',
          avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          totalSpentXOF: spentAmountInXOF,
          totalTokens: newOrder.tokensCount,
          level: (user.level || 1) + 1,
          gameId: newOrder.gameId,
          countryCode: selectedCountry.code,
          badgeTitle: 'Challenger LUXS',
        });
      }

      // Re-sort and re-rank
      updatedList.sort((a, b) => b.totalSpentXOF - a.totalSpentXOF);
      return updatedList.map((item, idx) => ({ ...item, rank: idx + 1 }));
    });

    // Update rewards progress
    setRewards((prev) =>
      prev.map((r) => {
        if (r.id === 'rew-1') {
          const nextVal = r.progressCurrent + newOrder.amount;
          return {
            ...r,
            progressCurrent: nextVal,
            status: nextVal >= r.progressTarget ? 'Disponible' : 'En cours',
          };
        }
        return r;
      })
    );

    return newOrder;
  };

  // Modals state
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSplashModalOpen, setIsSplashModalOpen] = useState(false);

  // Price Formatter according to currency & country
  const formatPrice = (priceXOF: number, priceXAF: number): string => {
    if (currency === 'XAF') {
      const converted = Math.round(priceXAF * adminConfig.conversionRateXOFtoXAF);
      return `${converted.toLocaleString('fr-FR')} XAF`;
    }
    return `${priceXOF.toLocaleString('fr-FR')} XOF`;
  };

  // Open WhatsApp Helper
  const openWhatsAppSupport = (customMessage?: string) => {
    const text = customMessage || "Bonjour LUXSPAY, j'ai une question concernant le service de recharge.";
    const url = `https://wa.me/${adminConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedGame,
        setSelectedGame,
        selectedCountry,
        setSelectedCountry,
        currency,
        setCurrency,
        formatPrice,
        favorites,
        toggleFavorite,
        isFavorite,
        savedPlayerIds,
        savePlayerId,
        removeSavedPlayerId,
        orders,
        createOrder,
        updateOrderStatus,
        simulateLiveStatusUpdate,
        lastOrderSuccess,
        setLastOrderSuccess,
        selectedOrderForModal,
        setSelectedOrderForModal,
        toasts,
        showToast,
        dismissToast,
        theme,
        setTheme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        searchHistory,
        addSearchHistory,
        clearSearchHistory,
        user,
        loginUser,
        logoutUser,
        leaderboard,
        rewards,
        claimReward,
        notifications,
        markNotificationAsRead,
        unreadNotificationsCount,
        isCountryModalOpen,
        setIsCountryModalOpen,
        isHelpModalOpen,
        setIsHelpModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        isNotificationsModalOpen,
        setIsNotificationsModalOpen,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isSplashModalOpen,
        setIsSplashModalOpen,
        adminConfig,
        updateAdminConfig,
        openWhatsAppSupport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
