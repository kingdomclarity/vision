import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useEngagementStore } from '../../store/useEngagementStore';
import { formatTimeAgo } from '../../lib/utils';
import { moderateContent } from '../../lib/moderation';

// ... existing imports ...

export function CommentSection({ contentId, onClose }: CommentSectionProps) {
  const { user } = useAuthStore();
  const { addComment, getComments } = useEngagementStore();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationMessage, setModerationMessage] = useState('');
  const comments = getComments(contentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setModerationMessage('');

    try {
      // Check content with AI moderation
      const result = await moderateContent(comment, 'comment');

      if (result.status === 'rejected') {
        setModerationMessage('This comment cannot be posted as it violates our community guidelines.');
        return;
      }

      if (result.status === 'pending') {
        setModerationMessage('Your comment will be visible after review (usually within 1 hour).');
        // Add to moderation queue but don't display yet
        addComment(contentId, comment, true);
      } else {
        // Comment approved, add and display immediately
        addComment(contentId, comment);
      }

      setComment('');
    } catch (error) {
      setModerationMessage('Unable to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Existing comment display code... */}

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!comment.trim() || isSubmitting}
            className="px-4 py-2 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Checking...' : 'Post'}
          </button>
        </div>
        {moderationMessage && (
          <p className="mt-2 text-sm text-red-600">{moderationMessage}</p>
        )}
      </form>
    </div>
  );
}