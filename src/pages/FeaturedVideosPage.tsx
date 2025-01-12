import React from 'react';
import { useParams } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import { VideoCard } from '../components/home/VideoCard';
import { formatViewCount } from '../lib/utils';

export function FeaturedVideosPage() {
  const { section } = useParams();
  const { getFeaturedVideos } = useVideoStore();

  const videos = getFeaturedVideos(section as any);
  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);

  return (
    <div className="bg-white min-h-screen py-8 px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">
          {section ? `Featured ${section}` : 'Featured Videos'}
        </h1>
        <p className="text-gray-600">
          {formatViewCount(totalViews)} total views • {videos.length} videos
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {videos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            onView={() => {}}
            size="small"
          />
        ))}
      </div>
    </div>
  );
}