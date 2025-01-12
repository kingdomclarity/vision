import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GiftType = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  points: number;
  description: string;
};

export const GIFTS: GiftType[] = [
  { id: 'diamond', name: 'Diamond', symbol: '💎', price: 100, points: 100000, description: 'Diamond Clarified Check badge' },
  { id: 'gold', name: 'Gold', symbol: '🏅', price: 50, points: 50000, description: 'Gold Clarified Check badge' },
  { id: 'silver', name: 'Silver', symbol: '🥈', price: 25, points: 25000, description: 'Silver Clarified Check badge' },
  { id: 'iron', name: 'Iron', symbol: '⚔️', price: 20, points: 20000, description: '2 swords' },
  { id: 'spark', name: 'Spark', symbol: '⚡', price: 10, points: 10000, description: 'Lightning bolt Sparks symbol' },
  { id: 'rainbow', name: 'Rainbow', symbol: '🌈', price: 7, points: 7000, description: '7 colors' },
  { id: 'trophy', name: 'Trophy', symbol: '🏆', price: 5, points: 5000, description: 'Gold trophy with CV logo' },
  { id: 'wisdom', name: 'Wisdom', symbol: '📖', price: 3, points: 3000, description: 'Bible symbol' },
  { id: 'rose', name: 'Rose', symbol: '🌹', price: 2, points: 2000, description: 'Rose' },
  { id: 'fire', name: 'Fire', symbol: '🔥', price: 1, points: 1000, description: 'Fire' },
  { id: 'trend', name: 'Trend', symbol: '📈', price: 1, points: 1000, description: 'Trending arrow' },
  { id: 'cross', name: 'Cross', symbol: '✝️', price: 1, points: 1000, description: 'Cross' },
  { id: 'love', name: 'Love', symbol: '❤️', price: 0.5, points: 500, description: 'Heart' },
  { id: 'jot', name: 'Jot', symbol: '✒️', price: 0.5, points: 500, description: 'Clarity Jot pen' },
  { id: 'chat', name: 'Chat', symbol: '💬', price: 0.5, points: 500, description: 'Clarity Chat logo' }
];

export const POINT_PACKAGES = [
  { id: '500', points: 500, price: 0.99 },
  { id: '1000', points: 1000, price: 1.99 },
  { id: '3000', points: 3000, price: 4.99 },
  { id: '6500', points: 6500, price: 9.99 },
  { id: '10000', points: 10000, price: 14.99 },
  { id: '15000', points: 15000, price: 19.99 },
  { id: '100000', points: 100000, price: 99.99 }
];

type GiftInstance = {
  id: string;
  giftId: string;
  senderId: string;
  recipientId: string;
  contentId: string;
  count: number;
  comment?: string;
  timestamp: string;
};

type GiftStore = {
  userPoints: Record<string, number>;
  gifts: GiftInstance[];
  addPoints: (userId: string, points: number) => void;
  removePoints: (userId: string, points: number) => boolean;
  getUserPoints: (userId: string) => number;
  sendGift: (
    giftId: string,
    senderId: string,
    recipientId: string,
    contentId: string,
    count: number,
    comment?: string
  ) => boolean;
  getContentGifts: (contentId: string) => GiftInstance[];
  getTopGift: (contentId: string) => GiftInstance | null;
};

export const useGiftStore = create<GiftStore>()(
  persist(
    (set, get) => ({
      userPoints: {},
      gifts: [],

      addPoints: (userId, points) =>
        set((state) => ({
          userPoints: {
            ...state.userPoints,
            [userId]: (state.userPoints[userId] || 0) + points
          }
        })),

      removePoints: (userId, points) => {
        const currentPoints = get().userPoints[userId] || 0;
        if (currentPoints < points) return false;

        set((state) => ({
          userPoints: {
            ...state.userPoints,
            [userId]: currentPoints - points
          }
        }));
        return true;
      },

      getUserPoints: (userId) => get().userPoints[userId] || 0,

      sendGift: (giftId, senderId, recipientId, contentId, count, comment) => {
        const gift = GIFTS.find(g => g.id === giftId);
        if (!gift) return false;

        const totalPoints = gift.points * count;
        if (!get().removePoints(senderId, totalPoints)) return false;

        const giftInstance: GiftInstance = {
          id: Math.random().toString(36).substr(2, 9),
          giftId,
          senderId,
          recipientId,
          contentId,
          count,
          comment,
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          gifts: [giftInstance, ...state.gifts]
        }));

        return true;
      },

      getContentGifts: (contentId) =>
        get().gifts.filter(gift => gift.contentId === contentId),

      getTopGift: (contentId) => {
        const gifts = get().gifts
          .filter(gift => gift.contentId === contentId)
          .sort((a, b) => {
            const giftA = GIFTS.find(g => g.id === a.giftId)!;
            const giftB = GIFTS.find(g => g.id === b.giftId)!;
            return giftB.price - giftA.price;
          });
        return gifts[0] || null;
      }
    }),
    {
      name: 'vision-gifts'
    }
  )
);