import { analytics } from './analytics';

// Mux configuration
const MUX_CONFIG = {
  tokenId: import.meta.env.VITE_MUX_TOKEN_ID,
  tokenSecret: import.meta.env.VITE_MUX_TOKEN_SECRET,
  webhookSigningSecret: 'hkbeau6ucsas8hfl67qf95o2eidf1i2o'
};

// Mux service class
export class MuxService {
  private static instance: MuxService;

  private constructor() {}

  static getInstance(): MuxService {
    if (!MuxService.instance) {
      MuxService.instance = new MuxService();
    }
    return MuxService.instance;
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

  async verifyWebhookSignature(signature: string, body: string): Promise<boolean> {
    try {
      // Verify webhook signature using crypto
      const crypto = await import('crypto');
      const hmac = crypto.createHmac('sha256', MUX_CONFIG.webhookSigningSecret);
      const expectedSignature = hmac.update(body).digest('hex');
      return signature === expectedSignature;
    } catch (error) {
      analytics.trackError(error as Error, { context: 'webhook_verification' });
      return false;
    }
  }
}

export const muxService = MuxService.getInstance();