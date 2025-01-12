import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { EmbedPlayer } from '../components/video/EmbedPlayer';

export function EmbedPage() {
  const { videoId } = useParams();
  const [searchParams] = useSearchParams();
  const startTime = parseInt(searchParams.get('t') || '0', 10);
  const autoplay = searchParams.get('autoplay') !== 'false';
  const showAds = searchParams.get('ads') !== 'false';

  if (!videoId) return null;

  return (
    <div className="w-full h-full">
      <EmbedPlayer
        videoId={videoId}
        startTime={startTime}
        autoplay={autoplay}
        showAds={showAds}
      />
    </div>
  );
}