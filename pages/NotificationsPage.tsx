import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft } from 'lucide-react';
import { formatTimeAgo } from '../lib/utils';

type NotificationType = 'all' | 'likes' | 'comments' | 'mentions' | 'shares' | 'playlists';

// Mock notifications data - replace with real data from Supabase
const notifications = [
  {
    id: '1',
    type: 'like',
    user: {
      username: 'sarah_smith',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith',
      isVerified: true
    },
    content: {
      id: 'video1',
      title: 'How to Build a React App',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=320&h=180&fit=crop'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
  },
  // ... other notifications
];

export function NotificationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NotificationType>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'likes') return notification.type === 'like';
    if (activeTab === 'comments') return notification.type === 'comment';
    if (activeTab === 'mentions') return notification.type === 'mention';
    if (activeTab === 'shares') return notification.type === 'share';
    if (activeTab === 'playlists') return notification.type === 'playlist';
    return true;
  });

  const renderNotificationContent = (notification: typeof notifications[0]) => {
    return (
      <div className="flex gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={notification.user.avatar}
              alt={notification.user.username}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium hover:text-gold-600">
                  {notification.user.username}
                </span>
                {notification.user.isVerified && (
                  <span className="inline-block w-4 h-4 bg-gold-500 text-white rounded-full text-[10px] flex items-center justify-center">
                    ✓
                  </span>
                )}
              </div>
              
              <p className="text-gray-600">
                {notification.type === 'like' && 'liked your video'}
                {notification.type === 'comment' && 'commented on your video'}
                {notification.type === 'mention' && 'mentioned you in a comment'}
                {notification.type === 'share' && 'shared your video'}
                {notification.type === 'playlist' && 'added your video to their playlist'}
              </p>

              <div className="text-sm text-gray-500 mt-2">
                {formatTimeAgo(notification.timestamp)}
              </div>
            </div>

            {/* Video Thumbnail */}
            <div className="flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={notification.content.thumbnail}
                alt={notification.content.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-lg text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-gold-500" />
            <h1 className="text-3xl font-medium">Notifications</h1>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All', icon: Bell },
            { id: 'likes', label: 'Likes', icon: Bell },
            { id: 'comments', label: 'Comments', icon: Bell },
            { id: 'mentions', label: 'Mentions', icon: Bell },
            { id: 'shares', label: 'Shares', icon: Bell },
            { id: 'playlists', label: 'Playlists', icon: Bell }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as NotificationType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gold-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map(notification => (
            <Link
              key={notification.id}
              to={`/watch/${notification.content.id}`}
              className="block bg-white rounded-xl p-4 hover:bg-gray-50"
            >
              {renderNotificationContent(notification)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}