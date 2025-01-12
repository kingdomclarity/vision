import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Video } from '../types';

export type Playlist = {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  collaborators: string[];
  videos: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

type PlaylistStore = {
  playlists: Record<string, Playlist>;
  recentlyWatched: string[];
  watchLater: string[];
  createPlaylist: (name: string, description?: string, isPublic?: boolean) => string;
  addToPlaylist: (playlistId: string, videoId: string) => void;
  removeFromPlaylist: (playlistId: string, videoId: string) => void;
  addToWatchLater: (videoId: string) => void;
  removeFromWatchLater: (videoId: string) => void;
  addToRecentlyWatched: (videoId: string) => void;
  addCollaborator: (playlistId: string, userId: string) => void;
  removeCollaborator: (playlistId: string, userId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  getPlaylist: (playlistId: string) => Playlist | null;
  getUserPlaylists: (userId: string) => Playlist[];
  isInWatchLater: (videoId: string) => boolean;
};

export const usePlaylistStore = create<PlaylistStore>()(
  persist(
    (set, get) => ({
      playlists: {},
      recentlyWatched: [],
      watchLater: [],

      createPlaylist: (name, description = '', isPublic = false) => {
        const id = Math.random().toString(36).substr(2, 9);
        const now = new Date().toISOString();
        
        set((state) => ({
          playlists: {
            ...state.playlists,
            [id]: {
              id,
              name,
              description,
              createdBy: 'current-user', // Replace with actual user ID
              collaborators: [],
              videos: [],
              isPublic,
              createdAt: now,
              updatedAt: now,
            },
          },
        }));

        return id;
      },

      addToPlaylist: (playlistId, videoId) => 
        set((state) => {
          const playlist = state.playlists[playlistId];
          if (!playlist || playlist.videos.includes(videoId)) return state;

          return {
            playlists: {
              ...state.playlists,
              [playlistId]: {
                ...playlist,
                videos: [...playlist.videos, videoId],
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      removeFromPlaylist: (playlistId, videoId) =>
        set((state) => {
          const playlist = state.playlists[playlistId];
          if (!playlist) return state;

          return {
            playlists: {
              ...state.playlists,
              [playlistId]: {
                ...playlist,
                videos: playlist.videos.filter((id) => id !== videoId),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      addToWatchLater: (videoId) =>
        set((state) => ({
          watchLater: state.watchLater.includes(videoId)
            ? state.watchLater
            : [videoId, ...state.watchLater],
        })),

      removeFromWatchLater: (videoId) =>
        set((state) => ({
          watchLater: state.watchLater.filter((id) => id !== videoId),
        })),

      addToRecentlyWatched: (videoId) =>
        set((state) => {
          const newRecent = [
            videoId,
            ...state.recentlyWatched.filter((id) => id !== videoId),
          ].slice(0, 50); // Keep only last 50 videos
          return { recentlyWatched: newRecent };
        }),

      addCollaborator: (playlistId, userId) =>
        set((state) => {
          const playlist = state.playlists[playlistId];
          if (!playlist || playlist.collaborators.includes(userId)) return state;

          return {
            playlists: {
              ...state.playlists,
              [playlistId]: {
                ...playlist,
                collaborators: [...playlist.collaborators, userId],
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      removeCollaborator: (playlistId, userId) =>
        set((state) => {
          const playlist = state.playlists[playlistId];
          if (!playlist) return state;

          return {
            playlists: {
              ...state.playlists,
              [playlistId]: {
                ...playlist,
                collaborators: playlist.collaborators.filter((id) => id !== userId),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      deletePlaylist: (playlistId) =>
        set((state) => {
          const { [playlistId]: _, ...rest } = state.playlists;
          return { playlists: rest };
        }),

      getPlaylist: (playlistId) => get().playlists[playlistId] || null,

      getUserPlaylists: (userId) =>
        Object.values(get().playlists).filter(
          (playlist) =>
            playlist.createdBy === userId ||
            playlist.collaborators.includes(userId)
        ),

      isInWatchLater: (videoId) => get().watchLater.includes(videoId),
    }),
    {
      name: 'vision-playlists',
    }
  )
);