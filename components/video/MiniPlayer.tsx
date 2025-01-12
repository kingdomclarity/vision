import React from 'react';
import { X } from 'lucide-react';
import { useVideoStore } from '../../store/useVideoStore';
import { Link } from 'react-router-dom';

export function MiniPlayer() {
  const { miniPlayerVideo, closeMiniPlayer } = useVideoStore();

  if (!miniPlayerVideo) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
      <div className="relative">
        <Link to={`/watch/${miniPlayerVideo.id}`}>
          <video
            src={miniPlayerVideo.videoUrl}
            className="w-full aspect-video"
            controls
            autoPlay
          />
        </Link>
        <button
          onClick={closeMiniPlayer}
          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-2">
        <Link 
          to={`/watch/${miniPlayerVideo.id}`}
          className="font-medium text-sm line-clamp-1 hover:text-gold-600"
        >
          {miniPlayerVideo.title}
        </Link>
        <Link 
          to={`/profile/${miniPlayerVideo.user.username}`}
          className="text-xs text-gray-600 hover:text-gray-900"
        >
          {miniPlayerVideo.user.username}
        </Link>
      </div>
    </div>
  );
}