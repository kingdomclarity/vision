import React, { useState } from 'react';
import { useLiveStore } from '../../store/useLiveStore';
import { EventCard } from './EventCard';
import { cn } from '../../lib/utils';

type SubTab = 'live' | 'upcoming' | 'replays';

export function EventsSection() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('live');
  const { getLiveEvents } = useLiveStore();
  const events = getLiveEvents().filter(event => event.isPPV);

  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'live', label: 'Live Now' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'replays', label: 'Replays' },
  ];

  const liveEvents = events
    .filter(event => event.status === 'live')
    .sort((a, b) => b.viewerCount - a.viewerCount);

  const upcomingEvents = events
    .filter(event => event.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());

  const replayEvents = events
    .filter(event => event.status === 'ended')
    .sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime());

  return (
    <div className="mt-8">
      <div className="flex gap-4 mb-8">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-colors",
              activeSubTab === tab.id
                ? "bg-gold-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {activeSubTab === 'live' && (
          <section>
            <h2 className="text-2xl font-medium mb-6">Live Events</h2>
            <div className="grid grid-cols-3 gap-6">
              {liveEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {activeSubTab === 'upcoming' && (
          <section>
            <h2 className="text-2xl font-medium mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {activeSubTab === 'replays' && (
          <section>
            <h2 className="text-2xl font-medium mb-6">Event Replays</h2>
            <div className="grid grid-cols-3 gap-6">
              {replayEvents.map(event => (
                <EventCard key={event.id} event={event} isReplay />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}