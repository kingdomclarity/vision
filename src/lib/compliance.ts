import { analytics } from './analytics';
import { db } from './db';

export class ComplianceSystem {
  private static instance: ComplianceSystem;

  private constructor() {
    this.initializeComplianceChecks();
  }

  static getInstance(): ComplianceSystem {
    if (!ComplianceSystem.instance) {
      ComplianceSystem.instance = new ComplianceSystem();
    }
    return ComplianceSystem.instance;
  }

  private initializeComplianceChecks() {
    // Run compliance checks periodically
    setInterval(() => {
      this.runComplianceChecks();
    }, 24 * 60 * 60 * 1000); // Daily
  }

  async runComplianceChecks(): Promise<void> {
    try {
      await Promise.all([
        this.checkDataRetention(),
        this.checkPrivacySettings(),
        this.checkUserConsent(),
        this.checkDataEncryption(),
        this.checkAccessLogs()
      ]);

      analytics.trackEvent('compliance_checks_completed');
    } catch (error) {
      analytics.trackError(error as Error, { context: 'compliance_checks' });
    }
  }

  private async checkDataRetention(): Promise<void> {
    const retentionPeriod = 90 * 24 * 60 * 60 * 1000; // 90 days
    const cutoffDate = new Date(Date.now() - retentionPeriod);

    // Delete old data
    await db.query(
      'DELETE FROM analytics_data WHERE created_at < $1',
      [cutoffDate]
    );
  }

  private async checkPrivacySettings(): Promise<void> {
    // Verify privacy settings are enforced
    const { data: users } = await db.query(
      'SELECT id, privacy_settings FROM profiles'
    );

    for (const user of users) {
      if (!user.privacy_settings) {
        // Set default privacy settings
        await db.query(
          'UPDATE profiles SET privacy_settings = $1 WHERE id = $2',
          [{ visibility: 'private' }, user.id]
        );
      }
    }
  }

  private async checkUserConsent(): Promise<void> {
    // Verify user consent records
    const { data: users } = await db.query(
      'SELECT id, consent_status FROM profiles'
    );

    for (const user of users) {
      if (!user.consent_status) {
        analytics.trackEvent('missing_user_consent', { userId: user.id });
      }
    }
  }

  private async checkDataEncryption(): Promise<void> {
    // Verify sensitive data is encrypted
    const tables = ['user_data', 'payment_info'];
    
    for (const table of tables) {
      const { error } = await db.query(
        `SELECT has_column_encryption FROM information_schema.tables 
         WHERE table_name = $1`,
        [table]
      );

      if (error) {
        analytics.trackError(error, { context: 'encryption_check' });
      }
    }
  }

  private async checkAccessLogs(): Promise<void> {
    // Verify access logging is enabled and working
    const { data: logs } = await db.query(
      'SELECT COUNT(*) FROM access_logs WHERE timestamp > $1',
      [new Date(Date.now() - 24 * 60 * 60 * 1000)]
    );

    if (!logs || logs.count === 0) {
      analytics.trackEvent('access_logging_issue');
    }
  }

  async handleDataRequest(userId: string, requestType: 'export' | 'delete'): Promise<void> {
    try {
      if (requestType === 'export') {
        const userData = await this.gatherUserData(userId);
        await this.exportUserData(userId, userData);
      } else {
        await this.deleteUserData(userId);
      }

      analytics.trackEvent('data_request_completed', { userId, requestType });
    } catch (error) {
      analytics.trackError(error as Error, { context: 'data_request' });
      throw error;
    }
  }

  private async gatherUserData(userId: string): Promise<any> {
    // Gather all user data
    const tables = ['profiles', 'videos', 'comments', 'likes'];
    const userData: Record<string, any> = {};

    for (const table of tables) {
      const { data } = await db.query(
        `SELECT * FROM ${table} WHERE user_id = $1`,
        [userId]
      );
      userData[table] = data;
    }

    return userData;
  }

  private async exportUserData(userId: string, data: any): Promise<void> {
    const jsonData = JSON.stringify(data, null, 2);
    
    // Store export in secure location
    await db.client.storage
      .from('data-exports')
      .upload(`${userId}/export_${Date.now()}.json`, jsonData);
  }

  private async deleteUserData(userId: string): Promise<void> {
    // Delete user data from all tables
    const tables = ['profiles', 'videos', 'comments', 'likes'];
    
    for (const table of tables) {
      await db.query(
        `DELETE FROM ${table} WHERE user_id = $1`,
        [userId]
      );
    }
  }
}

export const complianceSystem = ComplianceSystem.getInstance();