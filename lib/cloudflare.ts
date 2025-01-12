import { analytics } from './analytics';

// Cloudflare configuration
const CLOUDFLARE_CONFIG = {
  zoneId: import.meta.env.VITE_CLOUDFLARE_ZONE_ID,
  apiToken: import.meta.env.VITE_CLOUDFLARE_API_TOKEN,
  accountId: import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID
};

// Cloudflare service class
export class CloudflareService {
  private static instance: CloudflareService;

  private constructor() {}

  static getInstance(): CloudflareService {
    if (!CloudflareService.instance) {
      CloudflareService.instance = new CloudflareService();
    }
    return CloudflareService.instance;
  }

  getAssetUrl(path: string, options = {}) {
    const cdnDomain = 'https://cdn.vision.com';
    const params = new URLSearchParams(options as Record<string, string>);
    return `${cdnDomain}/${path}?${params}`;
  }

  async purgeCache(paths: string[]) {
    try {
      const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_CONFIG.zoneId}/purge_cache`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: paths
        })
      });

      if (!response.ok) {
        throw new Error('Failed to purge cache');
      }

      const result = await response.json();
      analytics.trackEvent('cache_purged', { paths });
      return result;
    } catch (error) {
      analytics.trackError(error as Error, { context: 'cache_purge' });
      throw error;
    }
  }

  async createStream(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.accountId}/stream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_CONFIG.apiToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create stream');
      }

      const result = await response.json();
      analytics.trackEvent('stream_created', { 
        fileSize: file.size,
        fileType: file.type
      });
      return result.result;
    } catch (error) {
      analytics.trackError(error as Error, { context: 'stream_creation' });
      throw error;
    }
  }
}

export const cloudflareService = CloudflareService.getInstance();