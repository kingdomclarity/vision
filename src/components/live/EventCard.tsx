import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Crown, Bell, Play } from 'lucide-react';
import { formatTimeAgo } from '../../lib/utils';
import type { LiveEvent } from '../../types';
import { useLiveStore } from '../../store/useLiveStore';

type EventCardProps = {
  event: LiveEvent;
  isReplay?: boolean;
};

export function EventCard({ event, isReplay }: EventCardProps) {
  const { hasAccessToEvent } = useLiveStore();
  
  const handleReminder = (e: React.MouseEvent) => {
    e.preventDefault();
    // Implement reminder functionality
    console.log('Set reminder for:', event.id);
  };

  const eventLink = !hasAccessToEvent(event.id) && event.isPPV 
    ? `/live/${event.id}/purchase` 
    : `/live/${event.id}`;

  return (
    <Link to={eventLink} className="group">
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <img
          src={event.thumbnailUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex items-center gap-2">
          {event.status === 'live' && (
            <>
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                LIVE
              </span>
              <span className="bg-black/50 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Users className="h-4 w-4" />
                {event.viewerCount.toLocaleString()}
              </span>
            </>
          )}
          {event.status === 'scheduled' && (
            <span className="bg-gold-500 text-white text-sm px-3 py-1 rounded-full">
              {formatTimeAgo(event.scheduledFor)}
            </span>
          )}
          {isReplay && (
            <span className="bg-purple-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Play className="h-4 w-4" />
              Replay
            </span>
          )}
          {event.isPPV && !hasAccessToEvent(event.id) && (
            <span className="bg-gold-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Crown className="h-4 w-4" />
              ${event.price}
            </span>
          )}
        </div>
        {event.status === 'scheduled' && (
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
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{event.description}</p>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img
                src={`https://ui-avatars.com/api/?name=${event.user.username}`}
                alt={event.user.username}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-gray-600 text-sm">{event.user.username}</span>
          </div>
          {event.status === 'scheduled' && (
            <span className="text-gray-600 text-sm">
              Starts {formatTimeAgo(event.scheduledFor)}
            </span>
          )}
          {hasAccessToEvent(event.id) && (
            <span className="text-green-600 text-sm font-medium">
              Purchased
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}