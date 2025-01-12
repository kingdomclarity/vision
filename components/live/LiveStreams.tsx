import React from 'react';
import { useLiveStore } from '../../store/useLiveStore';
import { LiveStreamCard } from './LiveStreamCard';

export function LiveStreams() {
  const { getLiveEvents } = useLiveStore();
  const events = getLiveEvents();

  const liveStreams = events
    .filter(event => event.status === 'live' && !event.isPPV)
    .sort((a, b) => b.viewerCount - a.viewerCount);

  const recentlyLive = events
    .filter(event => event.status === 'ended' && !event.isPPV)
    .sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime())
    .slice(0, 4); // Show only the 4 most recent streams

  return (
    <div className="mt-8">
      <div className="space-y-12">
        {/* Live Now */}
        <section>
          <h2 className="text-2xl font-medium mb-6">Live Now</h2>
          <div className="grid grid-cols-3 gap-6">
            {liveStreams.map(stream => (
              <LiveStreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </section>

        {/* Recently LIVE */}
        {recentlyLive.length > 0 && (
          <section>
            <h2 className="text-2xl font-medium mb-6">Recently LIVE</h2>
            <div className="grid grid-cols-4 gap-6">
              {recentlyLive.map(stream => (
                <LiveStreamCard key={stream.id} stream={stream} isReplay />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}