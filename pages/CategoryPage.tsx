import React from 'react';
import { useParams } from 'react-router-dom';
import { CategoryBanner } from '../components/category/CategoryBanner';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { UnlimitedSection } from '../components/UnlimitedSection';
import { VideoCard } from '../components/home/VideoCard';
import { useVideoStore } from '../store/useVideoStore';
import { formatViewCount } from '../lib/utils';
import type { Category } from '../types';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const formattedCategory = category?.charAt(0).toUpperCase() + category?.slice(1) as Category;
  const { getFeaturedVideos, getPersonalizedVideos, getTop100Videos } = useVideoStore();

  const handleVideoView = (videoId: string) => {
    // Implement view tracking logic
  };

  const allFeaturedVideos = getFeaturedVideos(formattedCategory);
  const totalViews = allFeaturedVideos.reduce((sum, video) => sum + video.views, 0);

  return (
    <div className="bg-white">
      <CategoryBanner category={formattedCategory} />
      <div className="px-8 py-6">
        <FeaturedSection
          title={`Featured ${formattedCategory}`}
          videos={getFeaturedVideos(formattedCategory)}
          viewMoreLink={`/featured/${formattedCategory}`}
          onVideoView={handleVideoView}
        />
        
        <FeaturedSection
          title={`${formattedCategory} For You`}
          videos={getPersonalizedVideos(formattedCategory)}
          viewMoreLink={`/category/${category}/recommended`}
          onVideoView={handleVideoView}
        />
        
        <FeaturedSection
          title={`Top 100 ${formattedCategory}`}
          videos={getTop100Videos(formattedCategory)}
          viewMoreLink={`/category/${category}/top-100`}
          onVideoView={handleVideoView}
        />
      </div>

      <UnlimitedSection />

      {/* Full Featured Videos Section */}
      <div id={`featured-${formattedCategory.toLowerCase()}`} className="px-8 py-12 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-3xl font-medium mb-2">All Featured {formattedCategory}</h2>
          <p className="text-gray-600">
            {formatViewCount(totalViews)} total views • {allFeaturedVideos.length} videos
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {allFeaturedVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onView={() => handleVideoView(video.id)}
              size="small"
            />
          ))}
        </div>
      </div>
    </div>
  );
}