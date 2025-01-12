import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Users, Heart, MessageCircle, Share2, Gift, Bell, Crown, Lock } from 'lucide-react';
import { formatTimeAgo, formatViewCount } from '../lib/utils';
import { useLiveStore } from '../store/useLiveStore';
import { useAuthStore } from '../store/useAuthStore';
import type { LiveEvent } from '../types';

export function LiveWatchPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getLiveEvents, hasAccessToEvent } = useLiveStore();
  const { user } = useAuthStore();
  const [showChat, setShowChat] = useState(true);
  const [message, setMessage] = useState('');

  const event = getLiveEvents().find(e => e.id === eventId);

  // Redirect to live page if event not found
  if (!event) {
    navigate('/live');
    return null;
  }

  const suggestedEvents = getLiveEvents()
    .filter(e => e.id !== eventId)
    .slice(0, 5);

  // Check if user has access to the stream
  const hasAccess = hasAccessToEvent(eventId!) || (user?.isPremium && event.user.isPremium);

  return (
    <div className="min-h-screen bg-white">
      {/* Video Player Section */}
      <div className="aspect-video bg-black relative">
        {hasAccess ? (
          <video
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            className="w-full h-full object-contain"
            controls
            autoPlay
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white">
            <Lock className="h-16 w-16 mb-4" />
            {event.isPPV ? (
              <>
                <h2 className="text-2xl font-medium mb-2">Premium Event</h2>
                <p className="text-gray-400 mb-4">Purchase this event to watch live</p>
                <Link
                  to={`/live/${eventId}/purchase`}
                  className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600"
                >
                  <Crown className="h-5 w-5" />
                  <span>Buy Now for ${event.price}</span>
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-medium mb-2">Members Only Stream</h2>
                <p className="text-gray-400 mb-4">Subscribe to {event.user.username} to watch</p>
                <button className="px-6 py-3 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600">
                  Become a Member
                </button>
              </>
            )}
          </div>
        )}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            LIVE
          </span>
          <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Users className="h-4 w-4" />
            {formatViewCount(event.viewerCount)}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Title and Metrics */}
            <div className="mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span>{formatTimeAgo(event.scheduledFor)}</span>
                <span>•</span>
                <span>{formatViewCount(event.viewerCount)} watching</span>
              </div>
              <h1 className="text-2xl font-medium">{event.title}</h1>
            </div>

            {/* Creator Info */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Link to={`/creator/${event.user.id}`} className="block">
                  <img
                    src={`https://ui-avatars.com/api/?name=${event.user.username}`}
                    alt={event.user.username}
                    className="w-12 h-12 rounded-full"
                  />
                </Link>
                <div>
                  <Link
                    to={`/creator/${event.user.id}`}
                    className="font-medium hover:text-gold-600"
                  >
                    {event.user.username}
                    {event.user.isVerified && (
                      <span className="ml-1 inline-block w-4 h-4 bg-gold-500 text-white rounded-full text-xs flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </Link>
                  <div className="text-sm text-gray-600">Event Host</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {!hasAccess && event.isPPV && (
                  <Link
                    to={`/live/${eventId}/purchase`}
                    className="flex items-center gap-2 px-6 py-2 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600"
                  >
                    <Crown className="h-5 w-5" />
                    <span>${event.price}</span>
                  </Link>
                )}
                {!hasAccess && !event.isPPV && event.user.isPremium && (
                  <button className="px-6 py-2 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600">
                    Become a Member
                  </button>
                )}
                <button className="px-6 py-2 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600">
                  Follow
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 text-gray-600">
              <p>{event.description}</p>
            </div>
          </div>

          {/* Live Chat */}
          {showChat && event.chatEnabled && (
            <div className="w-96 bg-white border border-gray-200 rounded-lg flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Live Chat</h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Hide
                  </button>
                </div>
              </div>
              
              {hasAccess ? (
                <>
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[600px]">
                    {/* Chat messages would be populated here */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0">
                        <img
                          src="https://ui-avatars.com/api/?name=John"
                          alt="John"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <div>
                        <span className="font-medium">John</span>
                        <p className="text-sm text-gray-600">This is amazing! 🔥</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Send a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                      />
                      <button className="px-4 py-2 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600">
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <Lock className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-4">
                    {event.isPPV 
                      ? "Purchase this event to join the chat"
                      : "Subscribe to join the chat"
                    }
                  </p>
                  <Link
                    to={event.isPPV ? `/live/${eventId}/purchase` : '#'}
                    className="px-4 py-2 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600"
                  >
                    {event.isPPV ? `Buy Now $${event.price}` : "Become a Member"}
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Suggested Events (when chat is hidden) */}
          {!showChat && (
            <div className="w-96">
              <h3 className="font-medium mb-4">Recommended Events</h3>
              <div className="space-y-4">
                {suggestedEvents.map(event => (
                  <Link
                    key={event.id}
                    to={`/live/${event.id}`}
                    className="flex gap-4 group"
                  >
                    <div className="w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img
                        src={event.thumbnailUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {event.status === 'live' ? (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          LIVE
                        </div>
                      ) : (
                        <div className="absolute top-2 left-2 bg-gold-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {formatTimeAgo(event.scheduledFor)}
                        </div>
                      )}
                      {event.isPPV && (
                        <div className="absolute top-2 right-2 bg-gold-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          ${event.price}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium line-clamp-2 group-hover:text-gold-600">
                        {event.title}
                      </h3>
                      <div className="mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {event.user.username}
                          {event.user.isVerified && (
                            <span className="w-3 h-3 bg-gold-500 text-white rounded-full text-[10px] flex items-center justify-center">
                              ✓
                            </span>
                          )}
                        </div>
                        <div>{formatViewCount(event.viewerCount)} watching</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}