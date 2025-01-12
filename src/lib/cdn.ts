// CDN configuration
const CLOUDFLARE_CONFIG = {
  zoneId: import.meta.env.VITE_CLOUDFLARE_ZONE_ID,
  apiToken: import.meta.env.VITE_CLOUDFLARE_API_TOKEN,
  accountId: import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID
};

// CDN service class
export class CDNService {
  private static instance: CDNService;

  private constructor() {}

  static getInstance(): CDNService {
    if (!CDNService.instance) {
      CDNService.instance = new CDNService();
    }
    return CDNService.instance;
  }

  getAssetUrl(path: string, options = {}) {
    const cdnDomain = 'https://cdn.vision.com';
    const params = new URLSearchParams(options as Record<string, string>);
    return `${cdnDomain}/${path}?${params}`;
  }

  async purgeCache(paths: string[]) {
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

    return response.json();
  }
}

export const cdnService = CDNService.getInstance();