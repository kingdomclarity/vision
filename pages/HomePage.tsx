import React from 'react';
import { FeaturedBanner } from '../components/home/FeaturedBanner';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { UnlimitedSection } from '../components/UnlimitedSection';
import { useVideoStore } from '../store/useVideoStore';
import type { Category } from '../types';

const categories: Category[] = [
  'Music',
  'Movies',
  'Sports',
  'Comedy',
  'News',
  'Podcasts',
  'Lifestyle',
  'Inspiration',
  'Arts',
  'Kids',
];

export function HomePage() {
  const { getFeaturedVideos, incrementViews } = useVideoStore();

  const handleVideoView = (videoId: string) => {
    incrementViews(videoId);
  };

  return (
    <div className="bg-white">
      <FeaturedBanner />
      <div className="px-8 py-6">
        <FeaturedSection
          title="Featured Videos"
          videos={getFeaturedVideos()}
          viewMoreLink="/featured"
          onVideoView={handleVideoView}
          featured
        />
        {categories.map((category) => (
          <FeaturedSection
            key={category}
            title={`Featured ${category}`}
            videos={getFeaturedVideos(category)}
            viewMoreLink={`/category/${category.toLowerCase()}#featured-${category.toLowerCase()}`}
            onVideoView={handleVideoView}
          />
        ))}
      </div>
      <UnlimitedSection />
    </div>
  );
}