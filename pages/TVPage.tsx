import React, { useState, useEffect } from 'react';
import { Info, ArrowLeft, Bell } from 'lucide-react';
import { useTVStore } from '../store/useTVStore';
import { formatTimeAgo } from '../lib/utils';

export function TVPage() {
  const {
    channels,
    activeChannel,
    showGuide,
    toggleGuide,
    setActiveChannel,
    selectShow,
    toggleReminder,
    hasReminder
  } = useTVStore();

  // Set initial active channel
  useEffect(() => {
    if (!activeChannel && channels.length > 0) {
      setActiveChannel(channels[0].id);
    }
  }, [channels, activeChannel, setActiveChannel]);

  const currentChannel = channels.find(c => c.id === activeChannel);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Video Player */}
      {currentChannel && (
        <div className="aspect-video bg-gray-900">
          <video
            src={currentChannel.streamUrl}
            className="w-full h-full object-contain"
            controls
            autoPlay
          />
        </div>
      )}
      
      {/* Channel Bar */}
      <div className="bg-gray-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">VISION TV Channels</h2>
          <button
            onClick={toggleGuide}
            className="flex items-center gap-2 text-gold-400 hover:text-gold-300"
          >
            <Info className="h-5 w-5" />
            <span>What's Next</span>
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {channels.map(channel => (
            <div
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`flex-shrink-0 group cursor-pointer ${
                channel.id === activeChannel ? 'scale-110' : ''
              }`}
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden mb-2">
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-center text-sm">
                <div className="font-medium truncate">{channel.name}</div>
                <div className="text-gray-400 text-xs">
                  {channel.currentViewers.toLocaleString()} watching
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Guide Overlay */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/80 z-50">
          <div className="max-w-3xl mx-auto mt-20 bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium">TV Guide</h3>
                <button
                  onClick={toggleGuide}
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              </div>

              {channels.map(channel => (
                <div key={channel.id} className="mb-8 last:mb-0">
                  <h4 className="text-lg font-medium mb-4">{channel.name}</h4>
                  <div className="space-y-4">
                    {channel.schedule.map(show => (
                      <div
                        key={show.id}
                        onClick={() => selectShow(show)}
                        className="w-full text-left p-4 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{show.title}</div>
                            <div className="text-sm text-gray-400">
                              Starts {formatTimeAgo(show.startTime)}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleReminder(show.id);
                            }}
                            className={`p-2 rounded-full ${
                              hasReminder(show.id)
                                ? 'bg-gold-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                            }`}
                          >
                            <Bell className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}