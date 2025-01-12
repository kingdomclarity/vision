import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Crown, CreditCard, Shield, Clock, Users, MessageCircle } from 'lucide-react';
import { useLiveStore } from '../store/useLiveStore';
import { formatTimeAgo, formatViewCount } from '../lib/utils';

export function EventPurchasePage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getLiveEvents, purchaseEvent } = useLiveStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const event = getLiveEvents().find(e => e.id === eventId);

  if (!event) {
    navigate('/live');
    return null;
  }

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Simulate purchase processing
    setTimeout(() => {
      purchaseEvent(eventId!);
      setIsProcessing(false);
      navigate(`/live/${eventId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="flex gap-8">
          {/* Event Details */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Event Preview */}
              <div className="relative aspect-video">
                <img
                  src={event.thumbnailUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-2xl font-medium text-white mb-2">{event.title}</h1>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeAgo(event.scheduledFor)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{formatViewCount(event.viewerCount)} watching</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={`https://ui-avatars.com/api/?name=${event.user.username}`}
                    alt={event.user.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      {event.user.username}
                      {event.user.isVerified && (
                        <span className="inline-block w-4 h-4 bg-gold-500 text-white rounded-full text-xs flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Event Host</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{event.description}</p>

                <div className="space-y-4">
                  <h3 className="font-medium">What's Included:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-600">
                      <Crown className="h-5 w-5 text-gold-500" />
                      <span>Full HD live stream access</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <MessageCircle className="h-5 w-5 text-gold-500" />
                      <span>Live chat participation</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <Clock className="h-5 w-5 text-gold-500" />
                      <span>Lifetime replay access</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Card */}
          <div className="w-96">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-medium mb-2">${event.price}</div>
                <p className="text-gray-600">One-time purchase</p>
              </div>

              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-gold-500 text-white px-6 py-3 rounded-full font-medium hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Purchase Now</span>
                  </>
                )}
              </button>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>Instant access after purchase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}