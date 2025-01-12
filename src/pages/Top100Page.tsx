import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Music, Film, Trophy, Laugh, Newspaper, Mic2, Heart, Church, Palette, Baby } from 'lucide-react';
import { useVideoStore } from '../store/useVideoStore';
import { VideoCard } from '../components/home/VideoCard';
import { cn } from '../lib/utils';
import type { Category } from '../types';

const categories = [
  { id: 'all', label: 'All', icon: TrendingUp },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'comedy', label: 'Comedy', icon: Laugh },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'podcasts', label: 'Podcasts', icon: Mic2 },
  { id: 'lifestyle', label: 'Lifestyle', icon: Heart },
  { id: 'inspiration', label: 'Inspiration', icon: Church },
  { id: 'arts', label: 'Arts', icon: Palette },
  { id: 'kids', label: 'Kids', icon: Baby },
];

export function Top100Page() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { videos } = useVideoStore();

  const calculateScore = (video: Video) => {
    const now = new Date();
    const lastUpdated = new Date(video.metrics.lastUpdated);
    const daysDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    
    // Only count metrics from the last 28 days
    if (daysDiff > 28) return 0;
    
    return (
      video.metrics.impressions * 1 +
      video.metrics.views * 2 +
      video.metrics.likes * 3 +
      video.metrics.comments * 4 +
      video.metrics.shares * 5
    );
  };

  const rankedVideos = useMemo(() => {
    const filteredVideos = selectedCategory === 'all'
      ? videos
      : videos.filter(video => video.category.toLowerCase() === selectedCategory);

    return filteredVideos
      .map(video => ({
        ...video,
        score: calculateScore(video)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
  }, [videos, selectedCategory]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8" />
            <h1 className="text-4xl font-medium">Top 100</h1>
          </div>
          <p className="text-xl text-gold-100">
            Trending videos ranked by engagement over the past 28 days
          </p>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-16 bg-white border-b border-gold-100 z-40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map(category => {
              const isActive = category.id === selectedCategory;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all",
                    isActive
                      ? "bg-gold-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <category.icon className="h-4 w-4" />
                  <span className="font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-6">
          {rankedVideos.map((video, index) => (
            <div key={video.id} className="relative">
              <div className="absolute -left-4 top-0 w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-medium z-10">
                {index + 1}
              </div>
              <VideoCard
                video={video}
                onView={() => {}}
                size="small"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}