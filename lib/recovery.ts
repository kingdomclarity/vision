import { db } from './db';
import { analytics } from './analytics';
import { backupSystem } from './backup';

export class RecoverySystem {
  private static instance: RecoverySystem;

  private constructor() {}

  static getInstance(): RecoverySystem {
    if (!RecoverySystem.instance) {
      RecoverySystem.instance = new RecoverySystem();
    }
    return RecoverySystem.instance;
  }

  async performRecovery(options: {
    type: 'full' | 'partial';
    backupId?: string;
    tables?: string[];
  }): Promise<void> {
    try {
      analytics.trackEvent('recovery_started', options);

      if (options.type === 'full') {
        await this.performFullRecovery(options.backupId);
      } else {
        await this.performPartialRecovery(options.tables || []);
      }

      analytics.trackEvent('recovery_completed', options);
    } catch (error) {
      analytics.trackError(error as Error, { context: 'recovery' });
      throw error;
    }
  }

  private async performFullRecovery(backupId?: string): Promise<void> {
    // If no backup ID provided, use latest
    if (!backupId) {
      const status = backupSystem.getBackupStatus();
      if (!status.lastBackup) {
        throw new Error('No backups available');
      }
    }

    // Restore from backup
    await backupSystem.restoreFromBackup(backupId!);
  }

  private async performPartialRecovery(tables: string[]): Promise<void> {
    // Verify table integrity
    for (const table of tables) {
      const { error } = await db.query(
        'SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)',
        [table]
      );

      if (error) {
        await this.repairTable(table);
      }
    }
  }

  private async repairTable(table: string): Promise<void> {
    try {
      // Attempt to repair table
      await db.query(`REINDEX TABLE ${table}`);
      
      // Verify repair
      const { error } = await db.query(`SELECT COUNT(*) FROM ${table}`);
      if (error) throw error;
    } catch (error) {
      analytics.trackError(error as Error, { context: 'table_repair', table });
      throw error;
    }
  }

  async verifyDataIntegrity(): Promise<boolean> {
    try {
      // Check database connection
      const isHealthy = await db.healthCheck();
      if (!isHealthy) return false;

      // Verify critical tables
      const criticalTables = ['profiles', 'videos', 'auth.users'];
      for (const table of criticalTables) {
        const { error } = await db.query(`SELECT COUNT(*) FROM ${table}`);
        if (error) return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}

export const recoverySystem = RecoverySystem.getInstance();