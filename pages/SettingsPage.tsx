import React, { useState } from 'react';
import {
  User, Bell, Play, Shield, CreditCard, 
  Sliders, Globe, Trash2, LogOut, Lock,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

type SettingsTab = 'account' | 'notifications' | 'playback' | 'privacy' | 'security' | 'billing' | 'dashboards';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    language: 'English (US)',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Temporarily enable both roles for testing
  const isAdmin = true;
  const isCreator = true;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement save changes logic
    console.log('Saving changes:', formData);
  };

  const tabs = [
    { id: 'account' as const, label: 'Account', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'playback' as const, label: 'Playback', icon: Play },
    { id: 'privacy' as const, label: 'Privacy', icon: Shield },
    { id: 'security' as const, label: 'Security', icon: Lock },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
    { id: 'dashboards' as const, label: 'Dashboards', icon: LayoutDashboard }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-medium mb-8">Settings</h1>
        
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left",
                    activeTab === tab.id
                      ? "bg-gold-50 text-gold-600"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {activeTab === 'account' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-medium mb-6">Account Settings</h2>
                  
                  {/* Profile */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden">
                        <img
                          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <form onSubmit={handleSaveChanges} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                        />
                      </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Language & Region</h3>
                      <div className="flex items-center gap-4">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                        >
                          <option>English (US)</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>

                  {/* Danger Zone */}
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                    <div className="space-y-4">
                      <button className="flex items-center gap-2 text-red-600 hover:text-red-700">
                        <Trash2 className="h-5 w-5" />
                        <span>Delete Account</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-700">
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tab content remains the same */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}