import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Loader } from 'lucide-react';
import { usePlaylistStore } from '../../store/usePlaylistStore';
import { PlaylistMenu } from './PlaylistMenu';
import { cn } from '../../lib/utils';

type VideoPreviewProps = {
  videoId: string;
  thumbnailUrl: string;
  videoUrl: string;
  previewUrl?: string;
  title: string;
  duration?: string;
};

export function VideoPreview({
  videoId,
  thumbnailUrl,
  videoUrl,
  previewUrl,
  title,
  duration,
}: VideoPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout>();
  const preloadVideoRef = useRef<HTMLVideoElement>();

  // Preload video in a hidden element
  useEffect(() => {
    if (previewUrl && !preloadVideoRef.current) {
      const video = document.createElement('video');
      video.src = previewUrl;
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      preloadVideoRef.current = video;
    }
  }, [previewUrl]);

  // Handle hover state
  useEffect(() => {
    if (isHovered && videoRef.current && preloadVideoRef.current) {
      setIsLoading(true);

      // Small delay before showing preview to avoid flashing on quick hovers
      loadTimeoutRef.current = setTimeout(() => {
        if (videoRef.current && preloadVideoRef.current) {
          videoRef.current.src = preloadVideoRef.current.src;
          videoRef.current.play().then(() => {
            setIsLoading(false);
          }).catch(() => {
            setIsLoading(false);
          });
        }
      }, 300);
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
      }
    };
  }, [isHovered]);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowPlaylistMenu(false);
        setIsLoading(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <Link to={`/watch/${videoId}`} className="block">
        <div className="relative aspect-video rounded-xl overflow-hidden">
          {/* Thumbnail */}
          <img
            src={thumbnailUrl}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              (isHovered && !isLoading && previewUrl) ? "opacity-0" : "opacity-100"
            )}
          />

          {/* Video Preview */}
          {previewUrl && (
            <video
              ref={videoRef}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                (isHovered && !isLoading) ? "opacity-100" : "opacity-0"
              )}
              muted
              playsInline
              loop
            />
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Loader className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {/* Duration */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-0.5 rounded">
              {duration}
            </div>
          )}

          {/* Play Icon Overlay */}
          {isHovered && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="w-12 h-12 text-white" />
            </div>
          )}
        </div>
      </Link>

      {/* Save to Playlist Button */}
      <button
        onClick={() => setShowPlaylistMenu(true)}
        className={cn(
          "absolute top-2 right-2 p-2 rounded-full bg-black/80 text-white transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Playlist Menu */}
      {showPlaylistMenu && (
        <PlaylistMenu
          videoId={videoId}
          onClose={() => setShowPlaylistMenu(false)}
        />
      )}
    </div>
  );
}