import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import { useLiveStore } from '../store/useLiveStore';
import { useSparkStore } from '../store/useSparkStore';
import { useTVStore } from '../store/useTVStore';
import { VideoCard } from '../components/home/VideoCard';
import { EventCard } from '../components/live/EventCard';
import { SparkCard } from '../components/sparks/SparkCard';
import { formatViewCount } from '../lib/utils';
import { getLevenshteinDistance } from '../lib/search';

type Section = 'all' | 'videos' | 'live' | 'sparks' | 'tv';

type SearchResult<T> = {
  item: T;
  distance: number;
};

function getSearchResults<T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string
): { exact: T[]; approximate: SearchResult<T>[] } {
  const normalizedQuery = query.toLowerCase();
  const exact: T[] = [];
  const approximate: SearchResult<T>[] = [];

  items.forEach(item => {
    const text = getSearchableText(item).toLowerCase();
    
    // Check for exact matches
    if (text.includes(normalizedQuery)) {
      exact.push(item);
      return;
    }

    // Check for approximate matches
    const distance = getLevenshteinDistance(normalizedQuery, text);
    if (distance <= 3) { // Threshold for "close enough" matches
      approximate.push({ item, distance });
    }
  });

  // Sort approximate matches by distance
  approximate.sort((a, b) => a.distance - b.distance);

  return { exact, approximate };
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [section, setSection] = useState<Section>('all');

  const { videos } = useVideoStore();
  const { getLiveEvents } = useLiveStore();
  const { sparks } = useSparkStore();
  const { channels } = useTVStore();

  // Get search results with both exact and approximate matches
  const videoResults = getSearchResults(
    videos,
    query,
    video => `${video.title} ${video.description} ${video.user.username}`
  );

  const liveResults = getSearchResults(
    getLiveEvents(),
    query,
    event => `${event.title} ${event.description} ${event.user.username}`
  );

  const sparkResults = getSearchResults(
    sparks,
    query,
    spark => `${spark.title} ${spark.description} ${spark.user.username}`
  );

  const tvResults = getSearchResults(
    channels,
    query,
    channel => `${channel.name} ${channel.description}`
  );

  const totalExactResults = 
    videoResults.exact.length + 
    liveResults.exact.length + 
    sparkResults.exact.length + 
    tvResults.exact.length;

  const totalApproximateResults = 
    videoResults.approximate.length + 
    liveResults.approximate.length + 
    sparkResults.approximate.length + 
    tvResults.approximate.length;

  // Update document title
  useEffect(() => {
    document.title = `${query} - Search Results - VISION`;
  }, [query]);

  return (
    <div className="min-h-screen bg-white py-8 px-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Search Results</h1>
        <p className="text-gray-600">
          Found {totalExactResults} exact {totalExactResults === 1 ? 'match' : 'matches'} 
          {totalApproximateResults > 0 && ` and ${totalApproximateResults} similar ${totalApproximateResults === 1 ? 'result' : 'results'}`} 
          for "{query}"
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-4 mb-8">
        {[
          { id: 'all', label: 'All Results' },
          { id: 'videos', label: 'Videos' },
          { id: 'live', label: 'Live & Events' },
          { id: 'sparks', label: 'Sparks' },
          { id: 'tv', label: 'TV Channels' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSection(tab.id as Section)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              section === tab.id
                ? 'bg-gold-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {/* Videos Section */}
        {(section === 'all' || section === 'videos') && 
          (videoResults.exact.length > 0 || videoResults.approximate.length > 0) && (
          <section>
            <h2 className="text-2xl font-medium mb-6">Videos</h2>
            
            {/* Exact Matches */}
            {videoResults.exact.length > 0 && (
              <div className="grid grid-cols-4 gap-6 mb-8">
                {(section === 'all' ? videoResults.exact.slice(0, 4) : videoResults.exact)
                  .map(video => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onView={() => {}}
                      size="small"
                    />
                  ))}
              </div>
            )}

            {/* Approximate Matches */}
            {videoResults.approximate.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-4">Similar Results</h3>
                <div className="grid grid-cols-4 gap-6">
                  {(section === 'all' ? videoResults.approximate.slice(0, 4) : videoResults.approximate)
                    .map(({ item: video }) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onView={() => {}}
                        size="small"
                      />
                    ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Live & Events Section */}
        {(section === 'all' || section === 'live') && 
          (liveResults.exact.length > 0 || liveResults.approximate.length > 0) && (
          <section>
            <h2 className="text-2xl font-medium mb-6">Live & Events</h2>
            
            {/* Exact Matches */}
            {liveResults.exact.length > 0 && (
              <div className="grid grid-cols-3 gap-6 mb-8">
                {(section === 'all' ? liveResults.exact.slice(0, 3) : liveResults.exact)
                  .map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </div>
            )}

            {/* Approximate Matches */}
            {liveResults.approximate.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-4">Similar Results</h3>
                <div className="grid grid-cols-3 gap-6">
                  {(section === 'all' ? liveResults.approximate.slice(0, 3) : liveResults.approximate)
                    .map(({ item: event }) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Sparks Section */}
        {(section === 'all' || section === 'sparks') && 
          (sparkResults.exact.length > 0 || sparkResults.approximate.length > 0) && (
          <section>
            <h2 className="text-2xl font-medium mb-6">Sparks</h2>
            
            {/* Exact Matches */}
            {sparkResults.exact.length > 0 && (
              <div className="grid grid-cols-4 gap-6 mb-8">
                {(section === 'all' ? sparkResults.exact.slice(0, 4) : sparkResults.exact)
                  .map(spark => (
                    <div 
                      key={spark.id} 
                      className="aspect-[9/16] w-full max-w-[calc(100vh*0.5625)] rounded-xl overflow-hidden"
                    >
                      <SparkCard spark={spark} isActive={false} />
                    </div>
                  ))}
              </div>
            )}

            {/* Approximate Matches */}
            {sparkResults.approximate.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-4">Similar Results</h3>
                <div className="grid grid-cols-4 gap-6">
                  {(section === 'all' ? sparkResults.approximate.slice(0, 4) : sparkResults.approximate)
                    .map(({ item: spark }) => (
                      <div 
                        key={spark.id} 
                        className="aspect-[9/16] w-full max-w-[calc(100vh*0.5625)] rounded-xl overflow-hidden"
                      >
                        <SparkCard spark={spark} isActive={false} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* TV Channels Section */}
        {(section === 'all' || section === 'tv') && 
          (tvResults.exact.length > 0 || tvResults.approximate.length > 0) && (
          <section>
            <h2 className="text-2xl font-medium mb-6">TV Channels</h2>
            
            {/* Exact Matches */}
            {tvResults.exact.length > 0 && (
              <div className="grid grid-cols-4 gap-6 mb-8">
                {(section === 'all' ? tvResults.exact.slice(0, 4) : tvResults.exact)
                  .map(channel => (
                    <Link
                      key={channel.id}
                      to={`/tv/${channel.id}`}
                      className="group"
                    >
                      <div className="aspect-video rounded-xl overflow-hidden mb-3">
                        <img
                          src={channel.logo}
                          alt={channel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-medium group-hover:text-gold-600">
                        {channel.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatViewCount(channel.currentViewers)} watching
                      </p>
                    </Link>
                  ))}
              </div>
            )}

            {/* Approximate Matches */}
            {tvResults.approximate.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-4">Similar Results</h3>
                <div className="grid grid-cols-4 gap-6">
                  {(section === 'all' ? tvResults.approximate.slice(0, 4) : tvResults.approximate)
                    .map(({ item: channel }) => (
                      <Link
                        key={channel.id}
                        to={`/tv/${channel.id}`}
                        className="group"
                      >
                        <div className="aspect-video rounded-xl overflow-hidden mb-3">
                          <img
                            src={channel.logo}
                            alt={channel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h3 className="font-medium group-hover:text-gold-600">
                          {channel.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatViewCount(channel.currentViewers)} watching
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* No Results */}
        {totalExactResults === 0 && totalApproximateResults === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No results found for "{query}"</p>
            <p className="text-sm text-gray-500 mt-2">
              Try different keywords or check your spelling
            </p>
          </div>
        )}
      </div>
    </div>
  );
}