import { createClient } from '@supabase/supabase-js';

// Content moderation confidence thresholds
const THRESHOLDS = {
  HIGH_RISK: 0.8,    // Immediate block
  MEDIUM_RISK: 0.4,  // Requires review
  LOW_RISK: 0.2      // Allow with flag
};

type ModerationType = 'video' | 'comment';
type ModerationStatus = 'approved' | 'pending' | 'rejected';

interface ModerationResult {
  status: ModerationStatus;
  confidence: number;
  timestamp?: number;
  categories: string[];
  needsReview: boolean;
  reviewPriority: 'high' | 'medium' | 'low';
}

export async function moderateContent(
  content: string | File,
  type: ModerationType,
  timestamp?: number
): Promise<ModerationResult> {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    // Call AI moderation service
    const { data, error } = await supabase.functions.invoke('moderate-content', {
      body: { content, type, timestamp }
    });

    if (error) throw error;

    const { confidence, categories } = data;

    // Determine moderation status based on confidence scores
    let status: ModerationStatus;
    let needsReview = false;
    let reviewPriority: 'high' | 'medium' | 'low' = 'low';

    if (confidence >= THRESHOLDS.HIGH_RISK) {
      status = 'rejected';
      needsReview = true;
      reviewPriority = 'high';
    } else if (confidence >= THRESHOLDS.MEDIUM_RISK) {
      status = 'pending';
      needsReview = true;
      reviewPriority = 'medium';
    } else if (confidence >= THRESHOLDS.LOW_RISK) {
      status = 'pending';
      needsReview = true;
      reviewPriority = 'low';
    } else {
      status = 'approved';
    }

    return {
      status,
      confidence,
      timestamp,
      categories,
      needsReview,
      reviewPriority
    };
  } catch (error) {
    console.error('Moderation failed:', error);
    // Fail safe - require manual review if AI fails
    return {
      status: 'pending',
      confidence: 1,
      timestamp,
      categories: ['error'],
      needsReview: true,
      reviewPriority: 'high'
    };
  }
}