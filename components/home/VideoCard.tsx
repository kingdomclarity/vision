import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo, formatViewCount } from '../../lib/utils';
import { VideoPreview } from '../video/VideoPreview';
import type { Video } from '../../types';

type VideoCardProps = {
  video: Video;
  onView: () => void;
  size?: 'small' | 'large';
};

export function VideoCard({ video, onView, size = 'small' }: VideoCardProps) {
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onView();
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`video-${video.id}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [video.id, onView]);

  return (
    <div className="group" id={`video-${video.id}`}>
      <VideoPreview
        videoId={video.id}
        thumbnailUrl={video.thumbnailUrl}
        videoUrl={video.videoUrl}
        title={video.title}
        duration={video.duration}
      />
      <div className="mt-3">
        <Link to={`/watch/${video.id}`}>
          <h3 className={`font-medium text-gray-900 group-hover:text-gold-600 transition-colors line-clamp-2 ${
            size === 'large' ? 'text-lg' : 'text-base'
          }`}>
            {video.title}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <Link 
            to={`/profile/${video.user.username}`} 
            className={`rounded-full overflow-hidden flex-shrink-0 ${
              size === 'large' ? 'w-8 h-8' : 'w-6 h-6'
            }`}
          >
            <img
              src={video.user.avatar || `https://ui-avatars.com/api/?name=${video.user.username}`}
              alt={video.user.username}
              className="w-full h-full object-cover"
            />
          </Link>
          <Link 
            to={`/profile/${video.user.username}`}
            className={`text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 ${
              size === 'large' ? 'text-sm' : 'text-xs'
            }`}
          >
            {video.user.username}
            {video.user.isVerified && (
              <span className="inline-block w-3 h-3 bg-gold-500 text-white rounded-full text-[8px] flex items-center justify-center">
                ✓
              </span>
            )}
          </Link>
        </div>
        <div className={`text-gray-500 flex items-center gap-2 mt-1 ${
          size === 'large' ? 'text-sm' : 'text-xs'
        }`}>
          <span>{formatViewCount(video.views)} views</span>
          <span>•</span>
          <span>{formatTimeAgo(video.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}