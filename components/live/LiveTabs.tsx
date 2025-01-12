import React from 'react';
import { Radio, CalendarDays, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

type LiveTabsProps = {
  activeTab: 'live' | 'events';
  onTabChange: (tab: 'live' | 'events') => void;
};

export function LiveTabs({ activeTab, onTabChange }: LiveTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex gap-8">
          <button
            onClick={() => onTabChange('live')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-lg font-medium border-b-2 transition-colors",
              activeTab === 'live'
                ? "border-gold-500 text-gold-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <Radio className="h-5 w-5" />
            <span>LIVE</span>
          </button>
          <button
            onClick={() => onTabChange('events')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-lg font-medium border-b-2 transition-colors",
              activeTab === 'events'
                ? "border-gold-500 text-gold-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <CalendarDays className="h-5 w-5" />
            <span>Events</span>
          </button>
        </div>
        
        <Link
          to="/live/create"
          className="flex items-center gap-2 bg-gold-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gold-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Go Live</span>
        </Link>
      </div>
    </div>
  );
}