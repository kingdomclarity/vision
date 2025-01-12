import React from 'react';
import { Link, Twitter, Facebook, Instagram, Copy } from 'lucide-react';
import { useEngagementStore } from '../../store/useEngagementStore';

type ShareDialogProps = {
  contentId: string;
  title: string;
  onClose: () => void;
};

export function ShareDialog({ contentId, title, onClose }: ShareDialogProps) {
  const { addShare } = useEngagementStore();
  const url = `${window.location.origin}/watch/${contentId}`;

  const handleShare = async (platform: string) => {
    addShare(contentId);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          // You could show a toast notification here
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-medium mb-4">Share</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50"
          >
            <Twitter className="h-6 w-6 text-[#1DA1F2]" />
            <span>Twitter</span>
          </button>
          
          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50"
          >
            <Facebook className="h-6 w-6 text-[#4267B2]" />
            <span>Facebook</span>
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
          <div className="flex-1 truncate text-gray-600">{url}</div>
          <button
            onClick={() => handleShare('copy')}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}