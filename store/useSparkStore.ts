import { create } from 'zustand';
import type { Spark, User } from '../types';

const mockSparks: Spark[] = [
  {
    id: '1',
    title: 'Amazing Dance Performance',
    description: 'Check out these incredible moves! 🔥',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    user: {
      id: 'user1',
      username: 'dancepro',
      avatar: 'https://ui-avatars.com/api/?name=dancepro',
      followers: 150000,
      isVerified: true,
    },
    likes: 25000,
    comments: 1200,
    shares: 3500,
    gifts: 150,
    hasLiked: false,
    isFollowing: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Street Performance',
    description: 'Urban dance vibes in the city 🌆',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498',
    user: {
      id: 'user2',
      username: 'urbanflow',
      avatar: 'https://ui-avatars.com/api/?name=urbanflow',
      followers: 89000,
      isVerified: true,
    },
    likes: 15000,
    comments: 800,
    shares: 2100,
    gifts: 90,
    hasLiked: false,
    isFollowing: false,
    createdAt: new Date().toISOString(),
  },
];

type SparkStore = {
  sparks: Spark[];
  getTopCreators: () => User[];
  addSpark: (spark: Omit<Spark, 'id' | 'createdAt'>) => void;
  toggleLike: (sparkId: string) => void;
  toggleFollow: (userId: string) => void;
  addComment: (sparkId: string, comment: string) => void;
  addShare: (sparkId: string) => void;
  addGift: (sparkId: string, giftType: string) => void;
};

export const useSparkStore = create<SparkStore>((set, get) => ({
  sparks: mockSparks,
  getTopCreators: () => {
    const creators = Array.from(new Set(mockSparks.map(spark => spark.user)));
    return creators.sort((a, b) => b.followers - a.followers).slice(0, 40);
  },
  addSpark: (spark) =>
    set((state) => ({
      sparks: [
        {
          ...spark,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        },
        ...state.sparks,
      ],
    })),
  toggleLike: (sparkId) =>
    set((state) => ({
      sparks: state.sparks.map((spark) =>
        spark.id === sparkId
          ? {
              ...spark,
              hasLiked: !spark.hasLiked,
              likes: spark.hasLiked ? spark.likes - 1 : spark.likes + 1,
            }
          : spark
      ),
    })),
  toggleFollow: (userId) =>
    set((state) => ({
      sparks: state.sparks.map((spark) =>
        spark.user.id === userId
          ? { ...spark, isFollowing: !spark.isFollowing }
          : spark
      ),
    })),
  addComment: (sparkId, comment) =>
    set((state) => ({
      sparks: state.sparks.map((spark) =>
        spark.id === sparkId
          ? { ...spark, comments: spark.comments + 1 }
          : spark
      ),
    })),
  addShare: (sparkId) =>
    set((state) => ({
      sparks: state.sparks.map((spark) =>
        spark.id === sparkId
          ? { ...spark, shares: spark.shares + 1 }
          : spark
      ),
    })),
  addGift: (sparkId, giftType) =>
    set((state) => ({
      sparks: state.sparks.map((spark) =>
        spark.id === sparkId
          ? { ...spark, gifts: spark.gifts + 1 }
          : spark
      ),
    })),
}));