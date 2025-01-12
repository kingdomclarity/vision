import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSparkStore } from '../store/useSparkStore';
import { SparkViewer } from '../components/sparks/SparkViewer';
import { cn, formatViewCount } from '../lib/utils';
import { 
  TrendingUp, Music, Film, Trophy, Laugh, Newspaper, 
  Mic2, Heart, Church, Palette, Baby, Zap
} from 'lucide-react';

type FeedType = 'trending' | 'following';

export function SparksPage() {
  const [activeTab, setActiveTab] = useState<FeedType>('trending');
  const { sparks, getTopCreators } = useSparkStore();
  const topCreators = getTopCreators();
  const hasFollowingSparks = sparks.some(spark => spark.isFollowing);

  return (
    <div className="h-[calc(100vh-4rem)] bg-white">
      {/* Feed Type Selector */}
      <div className="sticky top-16 z-50 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto flex justify-center py-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('trending')}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                activeTab === 'trending'
                  ? "bg-gold-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                activeTab === 'following'
                  ? "bg-gold-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              Following
            </button>
          </div>
        </div>
      </div>

      {/* Sparks Viewer */}
      <div className="h-[calc(100vh-8rem)] pt-4">
        {activeTab === 'following' && !hasFollowingSparks ? (
          <div className="max-w-lg mx-auto text-center pt-12">
            <h2 className="text-2xl font-medium mb-6">Looking for more Sparks?</h2>
            <p className="text-gray-600 mb-8">Follow these top creators</p>
            
            <div className="grid grid-cols-2 gap-4">
              {topCreators.map(creator => (
                <div
                  key={creator.id}
                  className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl"
                >
                  <img
                    src={creator.avatar || `https://ui-avatars.com/api/?name=${creator.username}`}
                    alt={creator.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate text-gray-900">{creator.username}</h3>
                    <p className="text-sm text-gray-600">
                      {creator.followers.toLocaleString()} followers
                    </p>
                  </div>
                  <button className="bg-gold-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gold-600 transition-colors">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <SparkViewer
            sparks={sparks.filter(spark => 
              activeTab === 'trending' || spark.isFollowing
            )}
          />
        )}
      </div>
    </div>
  );
}