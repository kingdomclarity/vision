import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Upload, Bell, User, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { BoltIcon } from './icons/BoltIcon';
import { SearchBar } from './search/SearchBar';

export function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="h-16 px-4">
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
          {/* Left: Logo - Fixed width to prevent shifting */}
          <div className="w-32 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <BoltIcon className="h-8 w-8 text-gold-500" />
              <span className="text-xl font-light tracking-wider text-gray-900">VISION</span>
            </Link>
          </div>

          {/* Center: Search - Flex grow to take available space */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl">
            <SearchBar />
          </div>

          {/* Right: Actions - Fixed width to prevent shifting */}
          <div className="w-32 flex items-center justify-end gap-4">
            {isAuthenticated && user ? (
              <>
                <Link to="/upload" className="text-gold-600 hover:text-gold-700 transition-colors hidden sm:block">
                  <Upload className="h-6 w-6" />
                </Link>
                <div className="relative">
                  <Link to="/notifications" className="text-gold-600 hover:text-gold-700 transition-colors">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
                  </Link>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gold-100 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 m-1 text-gold-600" />
                      )}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Link 
                      to={`/profile/${user.username}`} 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gold-50"
                    >
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gold-50">
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gold-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-2">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</Link>
            <Link to="/sparks" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Sparks</Link>
            <Link to="/tv" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">TV</Link>
            <Link to="/live" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Live</Link>
          </div>
        </div>
      )}
    </nav>
  );
}