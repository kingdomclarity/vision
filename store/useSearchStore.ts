import { create } from 'zustand';
import { useVideoStore } from './useVideoStore';
import { getLevenshteinDistance, areSimilarStrings } from '../lib/search';
import type { Video } from '../types';

type SearchSuggestion = {
  type: 'completion' | 'correction' | 'related';
  text: string;
  video?: Video;
};

type SearchStore = {
  query: string;
  suggestions: SearchSuggestion[];
  isOpen: boolean;
  setQuery: (query: string) => void;
  clearQuery: () => void;
  toggleOpen: (isOpen: boolean) => void;
  search: (query: string) => SearchSuggestion[];
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: '',
  suggestions: [],
  isOpen: false,
  setQuery: (query) => {
    const suggestions = get().search(query);
    set({ query, suggestions });
  },
  clearQuery: () => set({ query: '', suggestions: [] }),
  toggleOpen: (isOpen) => set({ isOpen }),
  search: (query) => {
    if (!query.trim()) return [];
    
    const { videos } = useVideoStore.getState();
    const suggestions: SearchSuggestion[] = [];
    const normalizedQuery = query.toLowerCase();
    
    // First, check for exact matches
    const exactMatches = videos.filter(video => 
      video.title.toLowerCase().includes(normalizedQuery)
    );

    // If no exact matches, prioritize spelling corrections
    if (exactMatches.length === 0) {
      const corrections = videos
        .filter(video => areSimilarStrings(query, video.title))
        .map(video => ({
          video,
          title: video.title,
          distance: getLevenshteinDistance(
            normalizedQuery,
            video.title.toLowerCase()
          )
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)
        .map(({ video, title }) => ({
          type: 'correction' as const,
          text: title,
          video
        }));
      suggestions.push(...corrections);
    }

    // Get word completions
    const completions = videos
      .filter(video => 
        video.title.toLowerCase().startsWith(normalizedQuery) ||
        video.title.toLowerCase().split(' ').some(word => 
          word.startsWith(normalizedQuery)
        )
      )
      .slice(0, 3)
      .map(video => ({
        type: 'completion' as const,
        text: video.title,
        video
      }));
    suggestions.push(...completions);

    // Get related content
    const related = videos
      .filter(video => 
        !exactMatches.includes(video) && // Don't show already matched videos
        !suggestions.some(s => s.video?.id === video.id) && // Don't show correction/completion matches
        (video.description.toLowerCase().includes(normalizedQuery) ||
         video.category.toLowerCase().includes(normalizedQuery))
      )
      .slice(0, 3)
      .map(video => ({
        type: 'related' as const,
        text: video.title,
        video
      }));
    suggestions.push(...related);

    return suggestions;
  }
}));