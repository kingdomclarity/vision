import { analytics } from './analytics';

// Video service class
export class VideoService {
  private static instance: VideoService;
  private muxClient: any;

  private constructor() {
    // Initialize Mux client
    this.initializeMux();
  }

  static getInstance(): VideoService {
    if (!VideoService.instance) {
      VideoService.instance = new VideoService();
    }
    return VideoService.instance;
  }

  private async initializeMux() {
    // Initialize Mux client with environment variables
    this.muxClient = {
      tokenId: import.meta.env.VITE_MUX_TOKEN_ID,
      tokenSecret: import.meta.env.VITE_MUX_TOKEN_SECRET
    };
  }

  async createAsset(file: File, options = {}) {
    try {
      // Create direct upload URL
      const response = await fetch('/api/mux/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          ...options
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create upload URL');
      }

      const { url, assetId } = await response.json();

      // Upload file
      await this.uploadToMux(file, url);

      analytics.trackEvent('video_uploaded', {
        fileSize: file.size,
        fileType: file.type
      });

      return assetId;
    } catch (error) {
      analytics.trackError(error as Error, { context: 'video_upload' });
      throw error;
    }
  }

  private async uploadToMux(file: File, url: string) {
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Mux');
    }
  }

  getPlaybackUrl(assetId: string, options = {}) {
    // Generate signed playback URL
    const params = new URLSearchParams({
      ...options,
      token: this.generatePlaybackToken(assetId)
    });

    return `https://stream.mux.com/${assetId}.m3u8?${params}`;
  }

  private generatePlaybackToken(assetId: string): string {
    // Implement JWT token generation for secure playback
    // This is just a placeholder - implement actual JWT signing
    return 'signed-token';
  }
}

export const videoService = VideoService.getInstance();