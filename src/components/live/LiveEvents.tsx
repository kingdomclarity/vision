import React from 'react';
import { Link } from 'react-router-dom';
import { useLiveStore } from '../../store/useLiveStore';
import { formatTimeAgo } from '../../lib/utils';
import { Crown, Users } from 'lucide-react';

export function LiveEvents() {
  const { getLiveEvents } = useLiveStore();
  const events = getLiveEvents();

  return (
    <div className="space-y-12">
      {/* Live Now */}
      <section>
        <h2 className="text-2xl font-medium mb-6">Live Now</h2>
        <div className="grid grid-cols-3 gap-6">
          {events
            .filter(event => event.status === 'live')
            .map(event => (
              <Link
                key={event.id}
                to={`/live/${event.id}`}
                className="group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-2">
                    <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                      LIVE
                    </span>
                    <span className="bg-black/50 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.viewerCount.toLocaleString()}
                    </span>
                  </div>
                  {event.isPPV && (
                    <div className="absolute top-2 right-2 bg-gold-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <Crown className="h-4 w-4" />
                      ${event.price}
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="font-medium text-lg group-hover:text-gold-600 transition-colors">
                    {event.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={`https://ui-avatars.com/api/?name=${event.user.username}`}
                        alt={event.user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-600">{event.user.username}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <h2 className="text-2xl font-medium mb-6">Upcoming Events</h2>
        <div className="space-y-4">
          {events
            .filter(event => event.status === 'scheduled')
            .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
            .map(event => (
              <Link
                key={event.id}
                to={`/live/${event.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-gold-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-48 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={event.thumbnailUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg mb-1">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                    <div className="flex items-center gap-4">
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
                      <span className="text-gray-600 text-sm">
                        Starts {formatTimeAgo(event.scheduledFor)}
                      </span>
                      {event.isPPV && (
                        <span className="text-gold-600 text-sm font-medium flex items-center gap-1">
                          <Crown className="h-4 w-4" />
                          ${event.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}