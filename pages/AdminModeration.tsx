import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Clock, AlertTriangle } from 'lucide-react';
import { formatTimeAgo } from '../lib/utils';

type ModerationItem = {
  id: string;
  content_id: string;
  content_type: 'video' | 'comment';
  status: 'pending' | 'approved' | 'rejected';
  confidence: number;
  categories: string[];
  review_priority: 'high' | 'medium' | 'low';
  timestamp?: number;
  created_at: string;
};

export function AdminModeration() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    loadModerationQueue();
  }, [filter]);

  async function loadModerationQueue() {
    setLoading(true);
    try {
      let query = supabase
        .from('moderation_queue')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (filter !== 'all') {
        query = query.eq('review_priority', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading moderation queue:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleModeration(id: string, approved: boolean) {
    try {
      const { error } = await supabase
        .from('moderation_queue')
        .update({
          status: approved ? 'approved' : 'rejected',
          reviewed_by: supabase.auth.getUser().then(({ data }) => data.user?.id),
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      await loadModerationQueue();
    } catch (error) {
      console.error('Error updating moderation status:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-gold-500" />
            <h1 className="text-3xl font-medium">Content Moderation</h1>
          </div>

          <div className="flex gap-2">
            {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => setFilter(priority)}
                className={`px-4 py-2 rounded-lg ${
                  filter === priority
                    ? 'bg-gold-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Clock className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading moderation queue...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No items requiring moderation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        item.review_priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : item.review_priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.review_priority.toUpperCase()} Priority
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(item.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>
                        Flagged categories: {item.categories.join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleModeration(item.id, false)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleModeration(item.id, true)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Approve
                    </button>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="mt-4">
                  {item.content_type === 'video' ? (
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        src={`/api/content/${item.content_id}`}
                        className="w-full h-full"
                        controls
                        controlsList="nodownload"
                      />
                      {item.timestamp && (
                        <div className="absolute bottom-4 left-4 bg-black/80 text-white px-2 py-1 rounded">
                          Flagged at {new Date(item.timestamp * 1000).toISOString().substr(11, 8)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{item.content_id}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}