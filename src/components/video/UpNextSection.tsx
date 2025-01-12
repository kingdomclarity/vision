import React from 'react';
import { Play } from 'lucide-react';
import { VideoCard } from '../home/VideoCard';
import { useVideoStore } from '../../store/useVideoStore';
import { cn } from '../../lib/utils';
import type { Video } from '../../types';

type UpNextSectionProps = {
  currentVideo: Video;
};

export function UpNextSection({ currentVideo }: UpNextSectionProps) {
  const { videos, autoplay, toggleAutoplay } = useVideoStore();
  
  const recommendations = videos
    .filter(video => 
      video.id !== currentVideo.id && 
      (video.category === currentVideo.category || 
       video.user.id === currentVideo.user.id)
    )
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Up Next</h3>
        <button
          onClick={toggleAutoplay}
          className="flex items-center gap-2 text-sm"
        >
          <div className={cn(
            "w-8 h-4 rounded-full transition-colors relative",
            autoplay ? "bg-gold-500" : "bg-gray-300"
          )}>
            <div className={cn(
              "absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform",
              autoplay && "translate-x-4"
            )} />
          </div>
          <span className="text-gray-600">Autoplay</span>
          <Play className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <div className="space-y-4">
        {recommendations.map(video => (
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