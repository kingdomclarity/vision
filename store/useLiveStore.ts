import { create } from 'zustand';
import type { LiveEvent } from '../types';

// Mock live events
const mockEvents: LiveEvent[] = [
  {
    id: '1',
    title: 'Live from Orlando: Music Festival',
    description: 'Join us for an incredible night of live music featuring top artists',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1280&h=720&fit=crop',
    category: 'Music',
    userId: 'user1',
    user: {
      id: 'user1',
      username: 'Orlando Events',
      email: 'events@example.com',
      isVerified: true,
      isPremium: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    scheduledFor: '2024-03-15T20:00:00Z',
    status: 'live',
    isPPV: true,
    price: 29.99,
    chatEnabled: true,
    chatPermissions: 'everyone',
    chatDelay: 30,
    chatReactionsEnabled: true,
    visibility: 'public',
    streamType: 'software',
    viewerCount: 15420,
    purchased: false,
  },
  {
    id: '2',
    title: 'Championship Boxing: Las Vegas',
    description: 'Watch the heavyweight championship fight live from Las Vegas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=1280&h=720&fit=crop',
    category: 'Sports',
    userId: 'user2',
    user: {
      id: 'user2',
      username: 'Vegas Sports',
      email: 'sports@example.com',
      isVerified: true,
      isPremium: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    scheduledFor: '2024-03-15T21:00:00Z',
    status: 'live',
    isPPV: true,
    price: 49.99,
    chatEnabled: true,
    chatPermissions: 'everyone',
    chatDelay: 30,
    chatReactionsEnabled: true,
    visibility: 'public',
    streamType: 'software',
    viewerCount: 8750,
    purchased: false,
  },
  {
    id: '3',
    title: 'Late Night Comedy Show',
    description: 'Live stand-up comedy from the best comedians',
    thumbnailUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1280&h=720&fit=crop',
    category: 'Comedy',
    userId: 'user3',
    user: {
      id: 'user3',
      username: 'Comedy Central',
      email: 'comedy@example.com',
      isVerified: true,
      isPremium: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    scheduledFor: '2024-03-15T22:00:00Z',
    status: 'live',
    isPPV: false,
    chatEnabled: true,
    chatPermissions: 'everyone',
    chatDelay: 30,
    chatReactionsEnabled: true,
    visibility: 'public',
    streamType: 'software',
    viewerCount: 5230,
    purchased: false,
  },
  {
    id: '4',
    title: '24/7 News Coverage',
    description: 'Breaking news and live updates',
    thumbnailUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1280&h=720&fit=crop',
    category: 'News',
    userId: 'user4',
    user: {
      id: 'user4',
      username: 'News Network',
      email: 'news@example.com',
      isVerified: true,
      isPremium: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    scheduledFor: '2024-03-15T00:00:00Z',
    status: 'live',
    isPPV: false,
    chatEnabled: true,
    chatPermissions: 'everyone',
    chatDelay: 30,
    chatReactionsEnabled: true,
    visibility: 'public',
    streamType: 'software',
    viewerCount: 12840,
    purchased: false,
  }
];

type LiveStore = {
  events: LiveEvent[];
  getLiveEvents: () => LiveEvent[];
  createLiveEvent: (event: Omit<LiveEvent, 'id' | 'viewerCount'>) => void;
  updateLiveEvent: (id: string, updates: Partial<LiveEvent>) => void;
  deleteLiveEvent: (id: string) => void;
  purchaseEvent: (eventId: string) => void;
  hasAccessToEvent: (eventId: string) => boolean;
};

export const useLiveStore = create<LiveStore>((set, get) => ({
  events: mockEvents,
  getLiveEvents: () => get().events,
  createLiveEvent: (event) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          ...event,
          id: Math.random().toString(36).substr(2, 9),
          viewerCount: 0,
          purchased: false,
        },
      ],
    })),
  updateLiveEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      ),
    })),
  deleteLiveEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
  purchaseEvent: (eventId) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId ? { ...event, purchased: true } : event
      ),
    })),
  hasAccessToEvent: (eventId) => {
    const event = get().events.find(e => e.id === eventId);
    if (!event) return false;
    return !event.isPPV || event.purchased;
  },
}));