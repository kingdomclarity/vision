import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Settings, Maximize2, 
  Clock, Share2, ExternalLink
} from 'lucide-react';
import { BoltIcon } from '../icons/BoltIcon';
import { useVideoStore } from '../../store/useVideoStore';
import { usePlaylistStore } from '../../store/usePlaylistStore';
import { cn } from '../../lib/utils';

type EmbedPlayerProps = {
  videoId: string;
  startTime?: number;
  autoplay?: boolean;
  showAds?: boolean;
};

export function EmbedPlayer({ videoId, startTime = 0, autoplay = false, showAds = true }: EmbedPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [quality, setQuality] = useState<'auto' | '1080p' | '720p' | '480p' | '360p'>('auto');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { videos } = useVideoStore();
  const { addToWatchLater } = usePlaylistStore();

  const video = videos.find(v => v.id === videoId);
  if (!video) return null;

  // Handle video chapters
  const chapters = video.chapters || [];
  const currentChapter = chapters.find(
    chapter => currentTime >= chapter.startTime && currentTime < chapter.endTime
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      if (autoplay) {
        videoRef.current.play();
      }
    }
  }, [startTime, autoplay]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.volume = newMuted ? 0 : volume;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleQualityChange = (newQuality: typeof quality) => {
    setQuality(newQuality);
    setShowSettings(false);
    // Implement quality change logic
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleWatchLater = async () => {
    if (video) {
      await addToWatchLater(video.id);
      // Show success toast
    }
  };

  const getEmbedCode = () => {
    const baseUrl = window.location.origin;
    return `<iframe 
      width="560" 
      height="315" 
      src="${baseUrl}/embed/${videoId}?t=${Math.floor(currentTime)}" 
      frameborder="0" 
      allowfullscreen
    ></iframe>`;
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="relative aspect-video bg-black"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />

      {/* Video Controls */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          {/* Chapter Title */}
          {currentChapter && (
            <div className="text-white text-sm">
              {currentChapter.title}
            </div>
          )}

          {/* Vision Logo */}
          <a 
            href={`/watch/${videoId}?t=${Math.floor(currentTime)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-gold-500 transition-colors"
          >
            <BoltIcon className="h-6 w-6" />
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="relative mb-4">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full"
            />
            {/* Chapter Markers */}
            {chapters.map(chapter => (
              <div
                key={chapter.startTime}
                className="absolute top-0 w-1 h-2 bg-gold-500"
                style={{ left: `${(chapter.startTime / duration) * 100}%` }}
              />
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-gold-500">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-gold-500">
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20"
              />
            </div>

            {/* Time Display */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div className="flex-1" />

            {/* Right Controls */}
            <button 
              onClick={handleWatchLater}
              className="text-white hover:text-gold-500"
            >
              <Clock className="h-6 w-6" />
            </button>

            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="text-white hover:text-gold-500"
            >
              <Share2 className="h-6 w-6" />
            </button>

            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:text-gold-500"
            >
              <Settings className="h-6 w-6" />
            </button>

            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-gold-500"
            >
              <Maximize2 className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Settings Menu */}
        {showSettings && (
          <div className="absolute bottom-16 right-4 bg-black/90 rounded-lg p-4 text-white">
            <div className="space-y-4">
              {/* Quality Settings */}
              <div>
                <div className="text-sm font-medium mb-2">Quality</div>
                {(['auto', '1080p', '720p', '480p', '360p'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => handleQualityChange(q)}
                    className={cn(
                      "block w-full text-left px-4 py-1 rounded hover:bg-white/10",
                      quality === q && "text-gold-500"
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Playback Speed */}
              <div>
                <div className="text-sm font-medium mb-2">Playback Speed</div>
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={cn(
                      "block w-full text-left px-4 py-1 rounded hover:bg-white/10",
                      playbackSpeed === speed && "text-gold-500"
                    )}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Share Menu */}
        {showShareMenu && (
          <div className="absolute bottom-16 right-4 bg-black/90 rounded-lg p-4 text-white">
            <div className="space-y-4">
              <div className="text-sm font-medium mb-2">Share</div>
              
              {/* Embed Code */}
              <div>
                <div className="text-xs text-gray-400 mb-1">Embed Code</div>
                <textarea
                  value={getEmbedCode()}
                  readOnly
                  className="w-full bg-white/10 rounded p-2 text-sm"
                  rows={3}
                />
              </div>

              {/* Social Share Buttons */}
              <div className="flex gap-2">
                {/* Add social share buttons */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}