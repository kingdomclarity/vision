import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, MessageCircle, Share2, Download, Plus, Gift,
  Settings, Volume2, Maximize2, SkipBack, SkipForward,
  Clock, ThumbsUp, ThumbsDown, Flag, ExternalLink,
  Play, Pause
} from 'lucide-react';
import { useVideoStore } from '../store/useVideoStore';
import { useEngagementStore } from '../store/useEngagementStore';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { formatTimeAgo, formatViewCount, cn } from '../lib/utils';
import { CommentSection } from '../components/engagement/CommentSection';
import { ShareDialog } from '../components/engagement/ShareDialog';
import { PlaylistMenu } from '../components/video/PlaylistMenu';
import { GiftDialog } from '../components/gifts/GiftDialog';
import { GiftDisplay } from '../components/gifts/GiftDisplay';
import { UpNextSection } from '../components/video/UpNextSection';

export function WatchPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { videos, setMiniPlayerVideo } = useVideoStore();
  const { toggleLike, hasLiked, toggleFollow, isFollowing } = useEngagementStore();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const playlistButtonRef = useRef<HTMLButtonElement>(null);

  const video = videos.find(v => v.id === videoId);

  useEffect(() => {
    setMiniPlayerVideo(null);
  }, [setMiniPlayerVideo]);

  useEffect(() => {
    const handleNavigation = () => {
      if (!location.pathname.startsWith('/watch/') && video) {
        setMiniPlayerVideo(video);
      }
    };

    return () => {
      handleNavigation();
    };
  }, [location, video, setMiniPlayerVideo]);

  if (!video) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Video Player */}
      <div className="aspect-video bg-black">
        <video
          src={video.videoUrl}
          className="w-full h-full"
          controls
          autoPlay
          playsInline
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Video Info */}
            <div className="mb-4">
              <h1 className="text-xl lg:text-2xl font-medium mb-2">{video.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>{formatViewCount(video.views)} views</span>
                <span>•</span>
                <span>{formatTimeAgo(video.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-t border-b">
              <button
                onClick={() => toggleLike(video.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  hasLiked(video.id)
                    ? "bg-gold-50 text-gold-600"
                    : "hover:bg-gray-100"
                )}
              >
                <Heart className={cn(
                  "h-5 w-5",
                  hasLiked(video.id) && "fill-current"
                )} />
                <span className="hidden sm:inline">{formatViewCount(video.likes)}</span>
              </button>

              <button
                onClick={() => setShowShareDialog(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100"
              >
                <Share2 className="h-5 w-5" />
                <span className="hidden sm:inline">{formatViewCount(video.shares)}</span>
              </button>

              <button
                onClick={() => setShowGiftDialog(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100"
              >
                <Gift className="h-5 w-5" />
                <span className="hidden sm:inline">Gift</span>
              </button>

              <button
                ref={playlistButtonRef}
                onClick={() => setShowPlaylistMenu(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">Save</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100">
                <Download className="h-5 w-5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>

            {/* Channel Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <Link to={`/profile/${video.user.username}`}>
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={video.user.avatar || `https://ui-avatars.com/api/?name=${video.user.username}`}
                      alt={video.user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div>
                  <Link
                    to={`/profile/${video.user.username}`}
                    className="font-medium hover:text-gold-600"
                  >
                    {video.user.username}
                    {video.user.isVerified && (
                      <span className="ml-1 inline-block w-4 h-4 bg-gold-500 text-white rounded-full text-xs flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </Link>
                  <div className="text-sm text-gray-600">
                    {video.user.followers?.toLocaleString()} followers
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleFollow(video.user.id)}
                className={cn(
                  "w-full sm:w-auto px-6 py-2 rounded-full font-medium transition-colors",
                  isFollowing(video.user.id)
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    : "bg-gold-500 text-white hover:bg-gold-600"
                )}
              >
                {isFollowing(video.user.id) ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Description */}
            <div className="mt-4 text-gray-600 whitespace-pre-wrap">
              {video.description}
            </div>

            {/* Comments */}
            <div className="mt-8">
              <CommentSection contentId={video.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96">
            <UpNextSection currentVideo={video} />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showShareDialog && (
        <ShareDialog
          contentId={video.id}
          title={video.title}
          onClose={() => setShowShareDialog(false)}
        />
      )}

      {showGiftDialog && (
        <GiftDialog
          contentId={video.id}
          recipientId={video.user.id}
          onClose={() => setShowGiftDialog(false)}
        />
      )}

      {showPlaylistMenu && (
        <PlaylistMenu
          videoId={video.id}
          onClose={() => setShowPlaylistMenu(false)}
          buttonRef={playlistButtonRef}
        />
      )}

      {/* Gift Display */}
      <div className="fixed bottom-4 left-4">
        <GiftDisplay contentId={video.id} />
      </div>
    </div>
  );
}