export type Category = 
  | 'Music'
  | 'Movies'
  | 'Sports'
  | 'Comedy'
  | 'News'
  | 'Podcasts'
  | 'Lifestyle'
  | 'Inspiration'
  | 'Arts'
  | 'Kids';

export type User = {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
  isPremium: boolean;
  createdAt: string;
  profile?: any;
  avatar?: string;
  followers?: number;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  previewUrl?: string;
  category: Category;
  userId: string;
  user: User;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  createdAt: string;
  isLive?: boolean;
  isPPV?: boolean;
  duration?: string;
  chapters?: Array<{
    title: string;
    startTime: number;
    endTime: number;
  }>;
  metrics: {
    impressions: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    lastUpdated: string;
  };
};

export type LiveEvent = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  userId: string;
  user: User;
  scheduledFor: string;
  status: 'scheduled' | 'live' | 'ended';
  isPPV: boolean;
  price?: number;
  chatEnabled: boolean;
  chatPermissions: string;
  chatDelay: number;
  chatReactionsEnabled: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  streamType: string;
  viewerCount: number;
  purchased?: boolean;
};

export type Spark = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    followers: number;
    isVerified: boolean;
  };
  likes: number;
  comments: number;
  shares: number;
  gifts: number;
  hasLiked: boolean;
  isFollowing: boolean;
  createdAt: string;
};

export type TVChannel = {
  id: string;
  name: string;
  logo: string;
  description: string;
  currentViewers: number;
  schedule: TVShow[];
  isLive: boolean;
  streamUrl: string;
};

export type TVShow = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  startTime: string;
  duration: number;
  channel: string;
};