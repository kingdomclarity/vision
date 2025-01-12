import { create } from 'zustand';
import type { TVChannel, TVShow } from '../types';

const mockChannels: TVChannel[] = [
  {
    id: 'vision-tv',
    name: 'VISION TV',
    logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=128&h=128&fit=crop',
    description: 'Official VISION TV Channel',
    currentViewers: 15420,
    isLive: true,
    streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    schedule: [
      {
        id: 'show-1',
        title: 'Primetime Hour',
        description: 'Your daily dose of entertainment and news',
        thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
        startTime: '2024-03-15T19:00:00Z',
        duration: 60,
        channel: 'vision-tv'
      },
      // Add more shows...
    ]
  },
  {
    id: 'newsmax',
    name: 'Newsmax',
    logo: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=128&h=128&fit=crop',
    description: '24/7 News Coverage',
    currentViewers: 8750,
    isLive: true,
    streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    schedule: [
      {
        id: 'show-2',
        title: 'Tucker Carlson Tonight',
        description: 'News and commentary with Tucker Carlson',
        thumbnail: 'https://images.unsplash.com/photo-1590341328520-63256eb32bc3',
        startTime: '2024-03-15T20:00:00Z',
        duration: 60,
        channel: 'newsmax'
      }
    ]
  },
  {
    id: 'firehouse',
    name: 'Firehouse TV',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&h=128&fit=crop',
    description: 'By Marcus Rogers',
    currentViewers: 5230,
    isLive: true,
    streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    schedule: []
  }
];

type TVStore = {
  channels: TVChannel[];
  activeChannel: string | null;
  showGuide: boolean;
  selectedShow: TVShow | null;
  reminders: Set<string>; // Show IDs
  getChannels: () => TVChannel[];
  setActiveChannel: (channelId: string) => void;
  toggleGuide: () => void;
  selectShow: (show: TVShow | null) => void;
  toggleReminder: (showId: string) => void;
  hasReminder: (showId: string) => boolean;
};

export const useTVStore = create<TVStore>((set, get) => ({
  channels: mockChannels,
  activeChannel: null,
  showGuide: false,
  selectedShow: null,
  reminders: new Set(),
  getChannels: () => get().channels,
  setActiveChannel: (channelId) => set({ activeChannel: channelId }),
  toggleGuide: () => set((state) => ({ showGuide: !state.showGuide })),
  selectShow: (show) => set({ selectedShow: show }),
  toggleReminder: (showId) => set((state) => {
    const reminders = new Set(state.reminders);
    if (reminders.has(showId)) {
      reminders.delete(showId);
    } else {
      reminders.add(showId);
    }
    return { reminders };
  }),
  hasReminder: (showId) => get().reminders.has(showId),
}));