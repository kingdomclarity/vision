import React from 'react';
import { Link } from 'react-router-dom';
import { VideoCard } from './VideoCard';
import type { Video } from '../../types';

type FeaturedSectionProps = {
  title: string;
  videos: Video[];
  viewMoreLink: string;
  onVideoView: (videoId: string) => void;
  featured?: boolean;
};

export function FeaturedSection({ title, videos, viewMoreLink, onVideoView, featured }: FeaturedSectionProps) {
  const topVideos = videos.slice(0, 2);
  const remainingVideos = videos.slice(2, 10);

  // For category pages, link to the section at the bottom
  const isCategory = viewMoreLink.startsWith('/featured/');
  const targetLink = isCategory && !featured ? `#featured-${viewMoreLink.split('/').pop()?.toLowerCase()}` : viewMoreLink;

  return (
    <section className="mt-16 first:mt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light tracking-wide text-gray-900">{title}</h2>
        {isCategory && !featured ? (
          <a
            href={targetLink}
            className="text-gold-500 hover:text-gold-600 font-medium transition-colors"
          >
            View All
          </a>
        ) : (
          <Link
            to={targetLink}
            className="text-gold-500 hover:text-gold-600 font-medium transition-colors"
          >
            View All
          </Link>
        )}
      </div>
      
      {/* Top 2 Featured Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {topVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onView={() => onVideoView(video.id)}
            size="large"
          />
        ))}
      </div>

      {/* Remaining Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {remainingVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onView={() => onVideoView(video.id)}
            size="small"
          />
        ))}
      </div>
    </section>
  );
}