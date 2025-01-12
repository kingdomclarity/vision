import React, { useState } from 'react';
import { LiveTabs } from '../components/live/LiveTabs';
import { LiveBanner } from '../components/live/LiveBanner';
import { LiveStreams } from '../components/live/LiveStreams';
import { EventsSection } from '../components/live/EventsSection';

export function LivePage() {
  const [activeTab, setActiveTab] = useState<'live' | 'events'>('live');

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <LiveTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="px-8">
          <LiveBanner />
          {activeTab === 'live' ? <LiveStreams /> : <EventsSection />}
        </div>
      </div>
    </div>
  );
}