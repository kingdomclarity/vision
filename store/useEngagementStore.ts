import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type EngagementStore = {
  likes: Set<string>;
  follows: Set<string>;
  comments: Record<string, Array<{ id: string; text: string; timestamp: string; }>>;
  shares: Set<string>;
  addLike: (contentId: string) => void;
  removeLike: (contentId: string) => void;
  toggleLike: (contentId: string) => void;
  hasLiked: (contentId: string) => boolean;
  addFollow: (userId: string) => void;
  removeFollow: (userId: string) => void;
  toggleFollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  addComment: (contentId: string, text: string) => void;
  getComments: (contentId: string) => Array<{ id: string; text: string; timestamp: string; }>;
  addShare: (contentId: string) => void;
  hasShared: (contentId: string) => boolean;
};

export const useEngagementStore = create<EngagementStore>()(
  persist(
    (set, get) => ({
      likes: new Set(),
      follows: new Set(),
      comments: {},
      shares: new Set(),

      addLike: (contentId) => set((state) => ({
        likes: new Set([...state.likes, contentId])
      })),

      removeLike: (contentId) => set((state) => {
        const newLikes = new Set(state.likes);
        newLikes.delete(contentId);
        return { likes: newLikes };
      }),

      toggleLike: (contentId) => {
        const hasLiked = get().hasLiked(contentId);
        if (hasLiked) {
          get().removeLike(contentId);
        } else {
          get().addLike(contentId);
        }
      },

      hasLiked: (contentId) => get().likes.has(contentId),

      addFollow: (userId) => set((state) => ({
        follows: new Set([...state.follows, userId])
      })),

      removeFollow: (userId) => set((state) => {
        const newFollows = new Set(state.follows);
        newFollows.delete(userId);
        return { follows: newFollows };
      }),

      toggleFollow: (userId) => {
        const isFollowing = get().isFollowing(userId);
        if (isFollowing) {
          get().removeFollow(userId);
        } else {
          get().addFollow(userId);
        }
      },

      isFollowing: (userId) => get().follows.has(userId),

      addComment: (contentId, text) => set((state) => {
        const comment = {
          id: Math.random().toString(36).substr(2, 9),
          text,
          timestamp: new Date().toISOString()
        };

        return {
          comments: {
            ...state.comments,
            [contentId]: [...(state.comments[contentId] || []), comment]
          }
        };
      }),

      getComments: (contentId) => get().comments[contentId] || [],

      addShare: (contentId) => set((state) => ({
        shares: new Set([...state.shares, contentId])
      })),

      hasShared: (contentId) => get().shares.has(contentId),
    }),
    {
      name: 'vision-engagement',
      partialize: (state) => ({
        likes: Array.from(state.likes),
        follows: Array.from(state.follows),
        comments: state.comments,
        shares: Array.from(state.shares),
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        likes: new Set(persistedState.likes),
        follows: new Set(persistedState.follows),
        comments: persistedState.comments,
        shares: new Set(persistedState.shares),
      }),
    }
  )
);