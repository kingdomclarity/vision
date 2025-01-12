import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  Upload, Settings, Video, TrendingUp, Users, Calendar, 
  ArrowLeft, ArrowUp, ArrowDown, MessageCircle, Eye, Heart,
  BarChart2, DollarSign, ShoppingBag, Zap
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { formatViewCount } from '../lib/utils';

type TimeRange = '24h' | '7d' | '28d' | '90d' | 'all';
type Tab = 'overview' | 'content' | 'analytics' | 'products' | 'community' | 'settings';

export function CreatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('28d');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'content', label: 'Content', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Mock data - replace with real data from Supabase
  const metrics = {
    views: 350000,
    watchTime: 1250000,
    followers: 7500,
    likes: 22000,
    comments: 3400,
    revenue: 15420,
    products: {
      total: 24,
      active: 18,
      outOfStock: 3,
      revenue: 8750
    },
    engagement: {
      rate: 8.5,
      trend: 'up',
      comments: 850,
      shares: 1200
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-medium flex items-center gap-2">
                  <Zap className="h-6 w-6 text-gold-500" />
                  VISION Studio
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your content, analyze performance, and grow your audience
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/upload')}
                className="flex items-center gap-2 px-6 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
              >
                <Upload className="h-5 w-5" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gold-500 text-gold-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Time Range Selector */}
        <div className="flex gap-2 mb-8">
          {[
            { value: '24h', label: 'Last 24 Hours' },
            { value: '7d', label: 'Last 7 Days' },
            { value: '28d', label: 'Last 28 Days' },
            { value: '90d', label: 'Last 90 Days' },
            { value: 'all', label: 'Lifetime' }
          ].map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as TimeRange)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === range.value
                  ? 'bg-gold-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Eye className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium">Views</h3>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <ArrowUp className="h-4 w-4" />
                    <span>12%</span>
                  </div>
                </div>
                <div className="text-2xl font-medium">
                  {formatViewCount(metrics.views)}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Users className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium">Followers</h3>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <ArrowUp className="h-4 w-4" />
                    <span>8%</span>
                  </div>
                </div>
                <div className="text-2xl font-medium">
                  {formatViewCount(metrics.followers)}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <Heart className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium">Engagement</h3>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <ArrowUp className="h-4 w-4" />
                    <span>15%</span>
                  </div>
                </div>
                <div className="text-2xl font-medium">
                  {metrics.engagement.rate}%
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium">Revenue</h3>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <ArrowUp className="h-4 w-4" />
                    <span>24%</span>
                  </div>
                </div>
                <div className="text-2xl font-medium">
                  ${metrics.revenue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Products Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-6">Products Performance</h3>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Products</div>
                  <div className="text-2xl font-medium">{metrics.products.total}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Active Listings</div>
                  <div className="text-2xl font-medium">{metrics.products.active}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Out of Stock</div>
                  <div className="text-2xl font-medium">{metrics.products.outOfStock}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Product Revenue</div>
                  <div className="text-2xl font-medium">${metrics.products.revenue.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { type: 'comment', user: 'Sarah', content: 'Great video! Really helpful content.' },
                  { type: 'purchase', user: 'Mike', content: 'purchased your course "Advanced Web Development"' },
                  { type: 'follow', user: 'Jessica', content: 'started following you' },
                  { type: 'share', user: 'David', content: 'shared your video "React Tips and Tricks"' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0">
                      <img
                        src={`https://ui-avatars.com/api/?name=${activity.user}`}
                        alt={activity.user}
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{activity.user}</div>
                      <div className="text-gray-600">{activity.content}</div>
                      <div className="text-sm text-gray-500 mt-1">2 hours ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tab content would go here */}
      </div>
    </div>
  );
}