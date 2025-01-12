import React, { useState } from 'react';
import { Gift, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGiftStore, GIFTS } from '../../store/useGiftStore';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';

type GiftDialogProps = {
  contentId: string;
  recipientId: string;
  onClose: () => void;
};

export function GiftDialog({ contentId, recipientId, onClose }: GiftDialogProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getUserPoints, sendGift } = useGiftStore();
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [giftCount, setGiftCount] = useState(1);
  const [comment, setComment] = useState('');

  const userPoints = user ? getUserPoints(user.id) : 0;
  const selectedGiftData = selectedGift ? GIFTS.find(g => g.id === selectedGift) : null;
  const totalCost = selectedGiftData ? selectedGiftData.points * giftCount : 0;

  const handleSendGift = () => {
    if (!user || !selectedGift) return;

    if (userPoints < totalCost) {
      // Redirect to points purchase page
      navigate(`/points/purchase?needed=${totalCost - userPoints}&returnTo=${encodeURIComponent(window.location.pathname)}`);
      onClose();
      return;
    }

    const success = sendGift(
      selectedGift,
      user.id,
      recipientId,
      contentId,
      giftCount,
      comment
    );

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-gold-500" />
            <h3 className="font-medium">Send a Gift</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Gift Selection */}
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4">
            {GIFTS.map(gift => (
              <button
                key={gift.id}
                onClick={() => setSelectedGift(gift.id)}
                className={cn(
                  "p-2 rounded-lg text-center hover:bg-gray-50",
                  selectedGift === gift.id && "bg-gold-50 border-2 border-gold-500"
                )}
              >
                <div className="text-2xl mb-1">{gift.symbol}</div>
                <div className="text-xs text-gray-600">
                  {gift.points.toLocaleString()}
                </div>
              </button>
            ))}
          </div>

          {selectedGift && (
            <>
              {/* Gift Count */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={giftCount}
                  onChange={(e) => setGiftCount(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Comment */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a comment (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Say something nice..."
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Your Points</div>
            <div className="font-medium">{userPoints.toLocaleString()}</div>
          </div>
          {selectedGift && (
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">Total Cost</div>
              <div className="font-medium">{totalCost.toLocaleString()}</div>
            </div>
          )}
          <button
            onClick={handleSendGift}
            disabled={!selectedGift}
            className="w-full py-2 bg-gold-500 text-white rounded-lg font-medium hover:bg-gold-600 disabled:opacity-50"
          >
            {userPoints < totalCost ? 'Purchase Points' : 'Send Gift'}
          </button>
        </div>
      </div>
    </div>
  );
}