import { create } from 'zustand';
import type { Video, Category } from '../types';

// Video preview URLs for optimized loading
const videoPreviewUrls = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
];

// Real Unsplash photo IDs for thumbnails
const thumbnailIds = [
  '1514525253161-7a46d19cd819',
  '1516450360452-9312f5e86fc7',
  '1511671782779-c97d3d27a1d4',
  '1459749411175-04bf5292ceea',
  '1489599849927-2ee91cede3ba',
  '1536440136628-849c177e76a1'
];

// Categories for video organization
const categories: Category[] = [
  'Music', 'Movies', 'Sports', 'Comedy', 'News', 
  'Podcasts', 'Lifestyle', 'Inspiration', 'Arts', 'Kids'
];

// Generate mock videos with valid preview URLs and thumbnails
const mockVideos: Video[] = [];

categories.forEach((category, categoryIndex) => {
  for (let i = 0; i < 10; i++) {
    const previewUrl = videoPreviewUrls[i % videoPreviewUrls.length];
    const thumbnailId = thumbnailIds[i % thumbnailIds.length];
    
    mockVideos.push({
      id: `${category}-${i}`,
      title: `${category} Video ${i + 1}`,
      description: `Amazing ${category.toLowerCase()} content`,
      thumbnailUrl: `https://images.unsplash.com/photo-${thumbnailId}?w=1280&h=720&fit=crop`,
      videoUrl: previewUrl,
      previewUrl,
      category,
      userId: `user${categoryIndex + 1}`,
      user: {
        id: `user${categoryIndex + 1}`,
        username: `${category} Creator ${i + 1}`,
        email: `creator${i}@example.com`,
        isVerified: true,
        isPremium: i % 2 === 0,
        createdAt: '2024-01-01T00:00:00Z',
      },
      views: Math.floor(Math.random() * 1000000),
      likes: Math.floor(Math.random() * 100000),
      shares: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 10000),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      isLive: i === 0,
      isPPV: i === 1,
      duration: `${Math.floor(Math.random() * 10 + 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      metrics: {
        impressions: Math.floor(Math.random() * 1000000),
        views: Math.floor(Math.random() * 500000),
        likes: Math.floor(Math.random() * 100000),
        comments: Math.floor(Math.random() * 50000),
        shares: Math.floor(Math.random() * 25000),
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  }
});

type VideoStore = {
  videos: Video[];
  autoplay: boolean;
  miniPlayerVideo: Video | null;
  getFeaturedVideos: (category?: Category) => Video[];
  getPersonalizedVideos: (category?: Category) => Video[];
  getTop100Videos: (category?: Category) => Video[];
  incrementViews: (videoId: string) => void;
  toggleAutoplay: () => void;
  setMiniPlayerVideo: (video: Video | null) => void;
  closeMiniPlayer: () => void;
};

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: mockVideos,
  autoplay: true,
  miniPlayerVideo: null,
  getFeaturedVideos: (category?: Category) => {
    const { videos } = get();
    const filteredVideos = category
      ? videos.filter((video) => video.category === category)
      : videos;
    
    return filteredVideos
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  },
  getPersonalizedVideos: (category?: Category) => {
    const { videos } = get();
    const filteredVideos = category
      ? videos.filter((video) => video.category === category)
      : videos;
    
    return filteredVideos
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  },
  getTop100Videos: (category?: Category) => {
    const { videos } = get();
    const filteredVideos = category
      ? videos.filter((video) => video.category === category)
      : videos;
    
    return filteredVideos
      .sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2))
      .slice(0, 10);
  },
  incrementViews: (videoId: string) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === videoId
          ? { ...video, views: video.views + 1 }
          : video
      ),
    })),
  toggleAutoplay: () => set((state) => ({ autoplay: !state.autoplay })),
  setMiniPlayerVideo: (video) => set({ miniPlayerVideo: video }),
  closeMiniPlayer: () => set({ miniPlayerVideo: null }),
}));