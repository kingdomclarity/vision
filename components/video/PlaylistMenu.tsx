import React, { useState } from 'react';
import { Plus, Check, Clock, List } from 'lucide-react';
import { usePlaylistStore } from '../../store/usePlaylistStore';
import { cn } from '../../lib/utils';

type PlaylistMenuProps = {
  videoId: string;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
};

export function PlaylistMenu({ videoId, onClose, buttonRef }: PlaylistMenuProps) {
  const {
    playlists,
    watchLater,
    addToWatchLater,
    removeFromWatchLater,
    addToPlaylist,
    removeFromPlaylist,
    createPlaylist,
  } = usePlaylistStore();
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const isInWatchLater = watchLater.includes(videoId);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const playlistId = createPlaylist(newPlaylistName);
    addToPlaylist(playlistId, videoId);
    setShowNewPlaylist(false);
    setNewPlaylistName('');
  };

  // Calculate position relative to button if ref exists
  const style = buttonRef?.current ? {
    position: 'absolute' as const,
    top: `${buttonRef.current.getBoundingClientRect().bottom + 8}px`,
    left: `${buttonRef.current.getBoundingClientRect().left}px`,
  } : {};

  return (
    <div
      className="w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Watch Later */}
      <button
        onClick={() => {
          isInWatchLater
            ? removeFromWatchLater(videoId)
            : addToWatchLater(videoId);
        }}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
      >
        <Clock className="w-5 h-5" />
        <span className="flex-1 text-left">Watch Later</span>
        {isInWatchLater && <Check className="w-5 h-5 text-green-500" />}
      </button>

      <div className="border-t border-gray-100">
        {/* Existing Playlists */}
        <div className="max-h-60 overflow-y-auto">
          {Object.values(playlists).map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => {
                const isInPlaylist = playlist.videos.includes(videoId);
                isInPlaylist
                  ? removeFromPlaylist(playlist.id, videoId)
                  : addToPlaylist(playlist.id, videoId);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              <List className="w-5 h-5" />
              <span className="flex-1 text-left truncate">{playlist.name}</span>
              {playlist.videos.includes(videoId) && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </button>
          ))}
        </div>

        {/* Create New Playlist */}
        {showNewPlaylist ? (
          <form onSubmit={handleCreatePlaylist} className="p-4 border-t">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
              className="w-full px-3 py-2 border rounded-lg mb-2"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewPlaylist(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newPlaylistName.trim()}
                className="px-3 py-1 text-sm bg-gold-500 text-white rounded-lg hover:bg-gold-600 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowNewPlaylist(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-gold-600 hover:bg-gray-50 border-t"
          >
            <Plus className="w-5 h-5" />
            <span>Create new playlist</span>
          </button>
        )}
      </div>
    </div>
  );
}