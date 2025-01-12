import React from 'react';
import { useGiftStore, GIFTS } from '../../store/useGiftStore';
import { formatTimeAgo } from '../../lib/utils';

type GiftDisplayProps = {
  contentId: string;
  showAll?: boolean;
};

export function GiftDisplay({ contentId, showAll = false }: GiftDisplayProps) {
  const { getContentGifts } = useGiftStore();
  const gifts = getContentGifts(contentId);

  if (gifts.length === 0) return null;

  const displayGifts = showAll ? gifts : gifts.slice(0, 3);

  return (
    <div className="space-y-2">
      {displayGifts.map(gift => {
        const giftData = GIFTS.find(g => g.id === gift.giftId)!;
        return (
          <div key={gift.id} className="flex items-center gap-2">
            <span className="text-2xl">{giftData.symbol}</span>
            <span className="text-sm text-gold-600 font-medium">
              {gift.count > 1 ? `${gift.count}x ` : ''}{giftData.name}
            </span>
            {gift.comment && (
              <span className="text-sm text-gray-600">• {gift.comment}</span>
            )}
            <span className="text-xs text-gray-500">
              • {formatTimeAgo(gift.timestamp)}
            </span>
          </div>
        );
      })}
      {!showAll && gifts.length > 3 && (
        <div className="text-sm text-gold-600">
          +{gifts.length - 3} more gifts
        </div>
      )}
    </div>
  );
}