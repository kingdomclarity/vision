import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Music, Film, Trophy, Laugh, Newspaper,
  Mic2, Heart, Church, Palette, Baby, TrendingUp,
  Tv, Zap, Radio, Crown, Settings,
} from 'lucide-react';
import { cn } from '../lib/utils';

const categories = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: TrendingUp, label: 'Top 100', path: '/top-100' },
  { icon: Zap, label: 'Sparks', path: '/sparks' },
  { icon: Radio, label: 'Live', path: '/live' },
  { icon: Crown, label: 'UNLIMITED', path: '/unlimited', premium: true },
  { icon: Tv, label: 'VISION TV', path: '/tv' },
  { icon: Music, label: 'Music', path: '/category/music' },
  { icon: Film, label: 'Movies', path: '/category/movies' },
  { icon: Trophy, label: 'Sports', path: '/category/sports' },
  { icon: Laugh, label: 'Comedy', path: '/category/comedy' },
  { icon: Newspaper, label: 'News', path: '/category/news' },
  { icon: Mic2, label: 'Podcasts', path: '/category/podcasts' },
  { icon: Heart, label: 'Lifestyle', path: '/category/lifestyle' },
  { icon: Church, label: 'Inspiration', path: '/category/inspiration' },
  { icon: Palette, label: 'Arts', path: '/category/arts' },
  { icon: Baby, label: 'Kids', path: '/category/kids' },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-52 bg-white border-r border-gold-100 overflow-y-auto hidden lg:block">
      <div className="p-4 flex flex-col h-full">
        <div className="flex-1">
          {categories.map((category) => {
            const active = isActive(category.path);
            return (
              <Link
                key={category.path}
                to={category.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all",
                  active && "bg-gold-50 font-medium",
                  category.premium 
                    ? "text-gold-500" 
                    : active 
                      ? "text-gold-700"
                      : "text-gray-700 hover:bg-gold-50 hover:text-gold-700"
                )}
              >
                <category.icon className={cn(
                  "h-5 w-5",
                  category.premium ? "text-gold-500" : active ? "text-gold-700" : ""
                )} />
                <span>{category.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="pt-4 border-t border-gold-100">
          <Link
            to="/settings"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all",
              isActive('/settings')
                ? "bg-gold-50 text-gold-700 font-medium"
                : "text-gray-700 hover:bg-gold-50 hover:text-gold-700"
            )}
          >
            <Settings className={cn(
              "h-5 w-5",
              isActive('/settings') && "text-gold-700"
            )} />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}