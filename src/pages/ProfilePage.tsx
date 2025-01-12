import React, { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useVideoStore } from '../store/useVideoStore';
import { useEngagementStore } from '../store/useEngagementStore';
import { formatTimeAgo, formatViewCount } from '../lib/utils';
import { MilestoneCircle } from '../components/profile/MilestoneCircle';
import { VideoCard } from '../components/home/VideoCard';
import { cn } from '../lib/utils';

type Tab = 'videos' | 'playlists';

export function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { videos } = useVideoStore();
  const { toggleFollow, isFollowing } = useEngagementStore();
  const [activeTab, setActiveTab] = useState<Tab>('videos');

  // Find user from videos
  const userVideos = videos.filter(video => video.user.username === username);
  const user = userVideos[0]?.user;

  // Calculate total views
  const totalViews = userVideos.reduce((sum, video) => sum + video.views, 0);

  // Redirect if user not found
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Image with Gradient Overlay */}
      <div className="relative h-80 bg-gradient-to-r from-gold-500 to-gold-600">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-8 text-white hover:text-white/80 transition-colors z-10"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="relative -mt-32">
          {/* Profile Header */}
          <div className="flex items-start gap-8 mb-8">
            {/* Avatar */}
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex-shrink-0">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* User Info */}
            <div className="flex-1 pt-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-medium text-white">{user.username}</h1>
                    {user.isVerified && (
                      <span className="w-6 h-6 bg-gold-500 text-white rounded-full text-sm flex items-center justify-center shadow-md">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-white/90 text-lg mb-4">
                    {user.bio || `Videos by ${user.username}`}
                  </div>
                  <div className="text-white/80">
                    Joined {formatTimeAgo(user.createdAt)}
                  </div>
                </div>

                <button 
                  onClick={() => toggleFollow(user.id)}
                  className={cn(
                    "px-8 py-3 rounded-full font-medium transition-all shadow-lg",
                    isFollowing(user.id)
                      ? "bg-white text-gray-900 hover:bg-gray-100"
                      : "bg-gold-500 text-white hover:bg-gold-600"
                  )}
                >
                  {isFollowing(user.id) ? (
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
                      Following
                    </div>
                  ) : (
                    'Follow'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-12 mb-8 bg-white rounded-2xl p-8 shadow-sm">
            <MilestoneCircle value={totalViews} label="Total Views" />
            <MilestoneCircle value={userVideos.length} label="Videos" />
            <MilestoneCircle value={user.followers || 0} label="Followers" />
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('videos')}
              className={cn(
                "px-4 py-4 font-medium border-b-2 transition-colors",
                activeTab === 'videos'
                  ? "border-gold-500 text-gold-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              )}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('playlists')}
              className={cn(
                "px-4 py-4 font-medium border-b-2 transition-colors",
                activeTab === 'playlists'
                  ? "border-gold-500 text-gold-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              )}
            >
              Playlists
            </button>
          </div>

          {/* Content */}
          {activeTab === 'videos' && (
            <div className="grid grid-cols-4 gap-6">
              {userVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onView={() => {}}
                  size="small"
                />
              ))}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="text-center py-12 text-gray-500">
              No playlists yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}