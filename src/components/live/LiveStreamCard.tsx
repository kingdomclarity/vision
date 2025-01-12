import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Play } from 'lucide-react';
import { formatTimeAgo } from '../../lib/utils';
import type { LiveEvent } from '../../types';

type LiveStreamCardProps = {
  stream: LiveEvent;
  isReplay?: boolean;
};

export function LiveStreamCard({ stream, isReplay }: LiveStreamCardProps) {
  const handleReminder = (e: React.MouseEvent) => {
    e.preventDefault();
    // Implement reminder functionality
    console.log('Set reminder for:', stream.id);
  };

  return (
    <Link to={`/live/${stream.id}`} className="group">
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <img
          src={stream.thumbnailUrl}
          alt={stream.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex items-center gap-2">
          {stream.status === 'live' && (
            <>
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                LIVE
              </span>
              <span className="bg-black/50 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Users className="h-4 w-4" />
                {stream.viewerCount.toLocaleString()}
              </span>
            </>
          )}
          {isReplay && (
            <span className="bg-purple-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Play className="h-4 w-4" />
              Replay
            </span>
          )}
          {stream.status === 'scheduled' && (
            <span className="bg-gold-500 text-white text-sm px-3 py-1 rounded-full">
              {formatTimeAgo(stream.scheduledFor)}
            </span>
          )}
        </div>
        {stream.status === 'scheduled' && (
          <button
            onClick={handleReminder}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gold-600 p-2 rounded-full transition-colors"
          >
            <Bell className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-medium text-lg group-hover:text-gold-600 transition-colors">
          {stream.title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={`https://ui-avatars.com/api/?name=${stream.user.username}`}
              alt={stream.user.username}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-gray-600">{stream.user.username}</span>
        </div>
        {isReplay && (
          <div className="mt-1 text-sm text-gray-500">
            Streamed {formatTimeAgo(stream.scheduledFor)}
          </div>
        )}
      </div>
    </Link>
  );
}