import React from 'react';
import { Settings, Shield, Database, Server } from 'lucide-react';

export function AdminSettings() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8 text-gold-500" />
        <h1 className="text-3xl font-medium">System Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Security Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-gold-500" />
            <h2 className="text-xl font-medium">Security Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Two-Factor Authentication</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                </div>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Require 2FA for all admin accounts
              </p>
            </div>

            <div>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Auto-lock Admin Panel</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                </div>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Automatically lock admin panel after 30 minutes of inactivity
              </p>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-gold-500" />
            <h2 className="text-xl font-medium">Database Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Database Backup Schedule
              </label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm rounded-md">
                <option>Every 6 hours</option>
                <option>Every 12 hours</option>
                <option>Every 24 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Backup Retention Period
              </label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm rounded-md">
                <option>7 days</option>
                <option>14 days</option>
                <option>30 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Server className="h-6 w-6 text-gold-500" />
            <h2 className="text-xl font-medium">System Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Maintenance Mode</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                </div>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Enable maintenance mode for system updates
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                System Log Level
              </label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm rounded-md">
                <option>Error</option>
                <option>Warning</option>
                <option>Info</option>
                <option>Debug</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}