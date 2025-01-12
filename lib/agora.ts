import { analytics } from './analytics';

// Agora configuration
const AGORA_CONFIG = {
  appId: import.meta.env.VITE_AGORA_APP_ID,
  appCertificate: import.meta.env.VITE_AGORA_APP_CERTIFICATE
};

// Agora service class
export class AgoraService {
  private static instance: AgoraService;
  private agoraClient: any = null;
  private localTracks: any = {
    audioTrack: null,
    videoTrack: null
  };
  private remoteUsers: any = {};

  private constructor() {}

  static getInstance(): AgoraService {
    if (!AgoraService.instance) {
      AgoraService.instance = new AgoraService();
    }
    return AgoraService.instance;
  }

  async getAgoraToken(channelName: string, uid: string): Promise<string> {
    try {
      // For development, return a temporary token
      // In production, this should call your token server
      return '006d7e0b32d486e4b25af1fc9c687c19c12IABnHPnhqQtJ3gJxGYyBACQWzSZZwFACvHJVq+i8w/YND6DfIYgAAAAAIgCQY79mjiZ00YEAAQB2JnTRAQB2JnTR';
    } catch (error) {
      analytics.trackError(error as Error, { context: 'token_generation' });
      throw error;
    }
  }

  async initializeStream(channelName: string, uid: string, role: 'host' | 'audience' = 'audience') {
    try {
      // Dynamically import Agora SDK
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      
      // Initialize client if not already done
      if (!this.agoraClient) {
        this.agoraClient = AgoraRTC.createClient({
          mode: 'live',
          codec: 'h264'
        });
      }

      await this.agoraClient.setClientRole(role);
      const token = await this.getAgoraToken(channelName, uid);
      
      await this.agoraClient.join(
        AGORA_CONFIG.appId,
        channelName,
        token,
        uid
      );

      if (role === 'host') {
        this.localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        this.localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
        
        await this.agoraClient.publish(Object.values(this.localTracks));
      }

      this.agoraClient.on('user-published', this.handleUserPublished);
      this.agoraClient.on('user-unpublished', this.handleUserUnpublished);

      analytics.trackEvent('stream_initialized', { channelName, role });
      
      return {
        client: this.agoraClient,
        localTracks: this.localTracks
      };
    } catch (error) {
      analytics.trackError(error as Error, { context: 'stream_initialization' });
      throw error;
    }
  }

  private handleUserPublished = async (user: any, mediaType: 'audio' | 'video') => {
    if (!this.agoraClient) return;
    
    await this.agoraClient.subscribe(user, mediaType);
    
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
    try {
      for (const track of Object.values(this.localTracks)) {
        if (track) {
          track.stop();
          track.close();
        }
      }
      this.localTracks = { audioTrack: null, videoTrack: null };
      this.remoteUsers = {};
      
      if (this.agoraClient) {
        await this.agoraClient.leave();
      }
      analytics.trackEvent('stream_left');
    } catch (error) {
      analytics.trackError(error as Error, { context: 'stream_leave' });
      throw error;
    }
  }
}

export const agoraService = AgoraService.getInstance();