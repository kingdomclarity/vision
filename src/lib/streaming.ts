import AgoraRTC from 'agora-rtc-sdk-ng';
import { analytics } from './analytics';

// Agora client configuration
const agoraClient = AgoraRTC.createClient({
  mode: 'live',
  codec: 'h264'
});

// Streaming service class
export class StreamingService {
  private static instance: StreamingService;
  private localTracks: any = {
    audioTrack: null,
    videoTrack: null
  };
  private remoteUsers: any = {};

  private constructor() {}

  static getInstance(): StreamingService {
    if (!StreamingService.instance) {
      StreamingService.instance = new StreamingService();
    }
    return StreamingService.instance;
  }

  async initializeStream(channelName: string, uid: string, role: 'host' | 'audience' = 'audience') {
    try {
      await agoraClient.setClientRole(role);
      const token = await this.getAgoraToken(channelName, uid);
      
      await agoraClient.join(
        import.meta.env.VITE_AGORA_APP_ID,
        channelName,
        token,
        uid
      );

      if (role === 'host') {
        this.localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        this.localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
        
        await agoraClient.publish(Object.values(this.localTracks));
      }

      agoraClient.on('user-published', this.handleUserPublished);
      agoraClient.on('user-unpublished', this.handleUserUnpublished);

      analytics.trackEvent('stream_initialized', { channelName, role });
      
      return {
        client: agoraClient,
        localTracks: this.localTracks
      };
    } catch (error) {
      analytics.trackError(error as Error, { context: 'stream_initialization' });
      throw error;
    }
  }

  private async getAgoraToken(channelName: string, uid: string): Promise<string> {
    const response = await fetch('/api/agora/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelName, uid })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get Agora token');
    }
    
    const { token } = await response.json();
    return token;
  }

  private handleUserPublished = async (user: any, mediaType: 'audio' | 'video') => {
    await agoraClient.subscribe(user, mediaType);
    
    if (mediaType === 'video') {
      this.remoteUsers[user.uid] = user;
    }
    
    analytics.trackEvent('user_published', { mediaType });
  }

  private handleUserUnpublished = (user: any) => {
    delete this.remoteUsers[user.uid];
    analytics.trackEvent('user_unpublished', { userId: user.uid });
  }

  async leaveStream() {
    for (const track of Object.values(this.localTracks)) {
      if (track) {
        track.stop();
        track.close();
      }
    }
    this.localTracks = { audioTrack: null, videoTrack: null };
    this.remoteUsers = {};
    
    await agoraClient.leave();
    analytics.trackEvent('stream_left');
  }
}

export const streamingService = StreamingService.getInstance();