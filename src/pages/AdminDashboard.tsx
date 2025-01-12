import React, { useState } from 'react';
import { Shield, Layout, Users, Flag, Settings, ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminModeration } from './AdminModeration';
import { AdminBanners } from './AdminBanners';
import { AdminUsers } from './AdminUsers';
import { AdminCategories } from './AdminCategories';
import { AdminSettings } from './AdminSettings';

type AdminTab = 'moderation' | 'banners' | 'users' | 'categories' | 'settings';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('moderation');

  // Mock AI moderation stats
  const moderationStats = {
    totalScanned: 15420,
    flagged: 245,
    approved: 14950,
    rejected: 225,
    pending: 245,
    accuracy: 99.2
  };

  const tabs = [
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'banners', label: 'Banners', icon: Layout },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: Flag },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <button
                onClick={() => navigate('/settings?tab=dashboards')}
                className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Shield className="h-6 w-6 text-gold-500" />
              <span className="text-xl font-medium">Admin Panel</span>
            </div>
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                    activeTab === tab.id
                      ? 'bg-gold-50 text-gold-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'moderation' && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-medium mb-2">AI Moderation Overview</h2>
                <p className="text-gray-600">Real-time content monitoring and analysis</p>
              </div>

              {/* AI Stats Grid */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Shield className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium">Total Scanned</h3>
                  </div>
                  <div className="text-2xl font-medium">
                    {moderationStats.totalScanned.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium">Flagged Content</h3>
                  </div>
                  <div className="text-2xl font-medium">
                    {moderationStats.flagged.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium">Approved</h3>
                  </div>
                  <div className="text-2xl font-medium">
                    {moderationStats.approved.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium">Rejected</h3>
                  </div>
                  <div className="text-2xl font-medium">
                    {moderationStats.rejected.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* AI Moderation Settings */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
                <h3 className="text-lg font-medium mb-6">AI Moderation Settings</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Sensitivity
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Very High</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto-Rejection Threshold
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>90%</option>
                      <option>85%</option>
                      <option>80%</option>
                      <option>75%</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Categories
                    </label>
                    <div className="space-y-2">
                      {[
                        'Violence & Gore',
                        'Adult Content',
                        'Hate Speech',
                        'Harassment',
                        'Self-Harm',
                        'Copyright Violation'
                      ].map(category => (
                        <label key={category} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-gold-500 rounded"
                            defaultChecked
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Rules
                    </label>
                    <div className="space-y-2">
                      {[
                        'Christian Values',
                        'Family-Friendly Content',
                        'Educational Content',
                        'Positive Messaging',
                        'Community Guidelines',
                        'Brand Safety'
                      ].map(rule => (
                        <label key={rule} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-gold-500 rounded"
                            defaultChecked
                          />
                          <span className="text-sm">{rule}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Moderation Queue */}
              <AdminModeration />
            </div>
          )}

          {activeTab === 'banners' && <AdminBanners />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}