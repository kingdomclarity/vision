import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Gift } from 'lucide-react';
import { useEngagementStore } from '../../store/useEngagementStore';
import { ShareDialog } from '../engagement/ShareDialog';
import { GiftDialog } from '../gifts/GiftDialog';
import { GiftDisplay } from '../gifts/GiftDisplay';
import type { Spark } from '../../types';
import { cn } from '../../lib/utils';

type SparkCardProps = {
  spark: Spark;
  isActive: boolean;
};

export function SparkCard({ spark, isActive }: SparkCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toggleLike, hasLiked, toggleFollow, isFollowing } = useEngagementStore();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showGiftDialog, setShowGiftDialog] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Ignore play interruption errors
        });
      }
    } else {
      video.pause();
    }

    return () => {
      if (video) {
        const pausePromise = video.pause();
        if (pausePromise !== undefined) {
          pausePromise.catch(() => {
            // Ignore pause interruption errors
          });
        }
      }
    };
  }, [isActive]);

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFollow(spark.user.id);
  };

  return (
    <div className="relative h-full bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        src={spark.videoUrl}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-12 p-4">
        <h2 className="text-white text-lg font-medium mb-2">{spark.title}</h2>
        <p className="text-white/80 text-sm mb-4">{spark.description}</p>
        
        <div className="flex items-center gap-4">
          <Link 
            to={`/profile/${spark.user.username}`}
            className="rounded-full overflow-hidden flex-shrink-0 w-10 h-10 border-2 border-white"
          >
            <img
              src={spark.user.avatar || `https://ui-avatars.com/api/?name=${spark.user.username}`}
              alt={spark.user.username}
              className="w-full h-full object-cover"
            />
          </Link>
          <div className="flex-1">
            <Link 
              to={`/profile/${spark.user.username}`}
              className="text-white font-medium flex items-center gap-1"
            >
              @{spark.user.username}
              {spark.user.isVerified && (
                <span className="inline-block w-4 h-4 bg-gold-500 text-white rounded-full text-xs flex items-center justify-center">
                  ✓
                </span>
              )}
            </Link>
            <div className="text-white/80 text-sm">
              {spark.user.followers.toLocaleString()} followers
            </div>
          </div>
          {!isFollowing(spark.user.id) && (
            <button 
              onClick={handleFollow}
              className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Follow
            </button>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="absolute right-4 bottom-4 flex flex-col items-center gap-6">
        <button 
          onClick={() => toggleLike(spark.id)}
          className="group flex flex-col items-center gap-1"
        >
          <div className={cn(
            "p-2 rounded-full transition-colors",
            hasLiked(spark.id) ? "bg-gold-500" : "bg-black/50 group-hover:bg-black/80"
          )}>
            <Heart className={cn(
              "w-6 h-6",
              hasLiked(spark.id) ? "text-white fill-current" : "text-white"
            )} />
          </div>
          <span className="text-white text-sm">{spark.likes.toLocaleString()}</span>
        </button>
        
        <button className="group flex flex-col items-center gap-1">
          <div className="p-2 rounded-full bg-black/50 group-hover:bg-black/80 transition-colors">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-sm">{spark.comments.toLocaleString()}</span>
        </button>
        
        <button 
          onClick={() => setShowShareDialog(true)}
          className="group flex flex-col items-center gap-1"
        >
          <div className="p-2 rounded-full bg-black/50 group-hover:bg-black/80 transition-colors">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-sm">{spark.shares.toLocaleString()}</span>
        </button>
        
        <button 
          onClick={() => setShowGiftDialog(true)}
          className="group flex flex-col items-center gap-1"
        >
          <div className="p-2 rounded-full bg-black/50 group-hover:bg-black/80 transition-colors">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-sm">{spark.gifts.toLocaleString()}</span>
        </button>
      </div>

      {/* Gift Display */}
      <div className="absolute left-4 bottom-32">
        <GiftDisplay contentId={spark.id} />
      </div>

      {showShareDialog && (
        <ShareDialog
          contentId={spark.id}
          title={spark.title}
          onClose={() => setShowShareDialog(false)}
        />
      )}

      {showGiftDialog && (
        <GiftDialog
          contentId={spark.id}
          recipientId={spark.user.id}
          onClose={() => setShowGiftDialog(false)}
        />
      )}
    </div>
  );
}