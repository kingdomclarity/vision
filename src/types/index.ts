// Add to existing types
export type TVShow = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  startTime: string;
  duration: number; // in minutes
  channel: string;
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