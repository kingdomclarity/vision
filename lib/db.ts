import { createClient } from '@supabase/supabase-js';

// Create a singleton Supabase client
class Database {
  private static instance: Database;
  public client: ReturnType<typeof createClient>;
  private connectionPool: Map<string, any> = new Map();
  private maxConnections = 20;

  private constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Validate URL and key
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    try {
      new URL(supabaseUrl); // Validate URL format
    } catch (error) {
      throw new Error('Invalid Supabase URL format');
    }

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: { 'x-application-name': 'vision' }
      }
    });

    // Set up connection pooling
    this.setupConnectionPool();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private setupConnectionPool() {
    // Initialize connection pool
    for (let i = 0; i < this.maxConnections; i++) {
      this.connectionPool.set(`connection-${i}`, {
        inUse: false,
        lastUsed: Date.now()
      });
    }
  }

  public async query(query: string, params?: any[]) {
    const connection = await this.getConnection();
    try {
      const { data, error } = await this.client
        .from('_raw')
        .query(query, params);
      return { data, error };
    } finally {
      this.releaseConnection(connection);
    }
  }

  public async batchInsert(table: string, records: any[]) {
    const batchSize = 100;
    const batches = [];

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      batches.push(
        this.client
          .from(table)
          .insert(batch)
      );
    }

    return Promise.all(batches);
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from('_health')
        .select('count(*)')
        .single();

      return !error && data !== null;
    } catch {
      return false;
    }
  }

  private async getConnection(): Promise<string> {
    // Find available connection
    for (const [id, conn] of this.connectionPool.entries()) {
      if (!conn.inUse) {
        conn.inUse = true;
        conn.lastUsed = Date.now();
        return id;
      }
    }

    // Wait for connection if all are in use
    return new Promise(resolve => {
      const interval = setInterval(() => {
        for (const [id, conn] of this.connectionPool.entries()) {
          if (!conn.inUse) {
            conn.inUse = true;
            conn.lastUsed = Date.now();
            clearInterval(interval);
            resolve(id);
            break;
          }
        }
      }, 100);
    });
  }

  private releaseConnection(connectionId: string) {
    const connection = this.connectionPool.get(connectionId);
    if (connection) {
      connection.inUse = false;
      connection.lastUsed = Date.now();
    }
  }
}

export const db = Database.getInstance();