// Cache configuration
const CACHE_CONFIG = {
  maxAge: 30 * 60 * 1000, // 30 minutes
  maxItems: 100
};

// Simple cache implementation
class Cache {
  private static instance: Cache;
  private cache: Map<string, { value: any; timestamp: number }>;

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set(key: string, value: any): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= CACHE_CONFIG.maxItems) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;

    // Check if item has expired
    if (Date.now() - item.timestamp > CACHE_CONFIG.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cache = Cache.getInstance();