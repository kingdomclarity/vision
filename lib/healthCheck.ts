import { db } from './db';
import { analytics } from './analytics';
import { alertSystem } from './alerts.ts';
import { backupSystem } from './backup';
import { complianceSystem } from './compliance';
import { agoraService } from './agora';
import { cloudflareService } from './cloudflare';
import { monitoring } from './monitoring';

class HealthCheck {
  private static instance: HealthCheck;
  private checkInterval = 5 * 60 * 1000; // 5 minutes
  private isRunning = false;
  private lastCheck: Date | null = null;

  private constructor() {
    if (import.meta.env.PROD) {
      this.startHealthChecks();
      this.setupErrorBoundary();
    }
  }

  private setupErrorBoundary() {
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.addEventListener('error', this.handleError);
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    analytics.trackError(event.reason, { context: 'unhandled_rejection' });
    alertSystem.createAlert({
      type: 'error',
      severity: 'critical',
      message: 'Unhandled Promise Rejection',
      data: { error: event.reason }
    });
  };

  private handleError = (event: ErrorEvent) => {
    analytics.trackError(event.error, { context: 'global_error' });
    alertSystem.createAlert({
      type: 'error',
      severity: 'critical',
      message: 'Global Error',
      data: { error: event.error }
    });
  };

  async runHealthChecks() {
    try {
      this.lastCheck = new Date();
      monitoring.startTransaction('health_check');

      const results = await Promise.all([
        this.checkDatabase(),
        this.checkAPI(),
        this.checkStorage(),
        this.checkBackups(),
        this.checkCompliance(),
        this.checkPerformance(),
        this.checkAgoraService(),
        this.checkCloudflareService(),
        this.checkCDN(),
        this.checkMemoryUsage(),
        this.checkNetworkLatency()
      ]);

      const allHealthy = results.every(result => result.healthy);

      if (!allHealthy) {
        alertSystem.createAlert({
          type: 'health_check',
          severity: 'error',
          message: 'System health check failed',
          data: results
        });

        // Attempt auto-recovery for certain issues
        await this.attemptRecovery(results);
      }

      analytics.trackEvent('health_check_completed', {
        healthy: allHealthy,
        results,
        duration: Date.now() - this.lastCheck.getTime()
      });

      monitoring.endTransaction('health_check');
    } catch (error) {
      monitoring.captureError(error);
      analytics.trackError(error as Error, { context: 'health_check' });
    }
  }

  private async attemptRecovery(results: any[]) {
    const failedComponents = results.filter(r => !r.healthy);
    
    for (const component of failedComponents) {
      try {
        switch (component.name) {
          case 'database':
            await db.reconnect();
            break;
          case 'storage':
            await this.cleanupStorage();
            break;
          case 'cdn':
            await this.refreshCDN();
            break;
          default:
            // Log unhandled component
            analytics.trackEvent('recovery_not_implemented', { component });
        }
      } catch (error) {
        analytics.trackError(error as Error, { 
          context: 'recovery',
          component: component.name 
        });
      }
    }
  }

  private async cleanupStorage() {
    // Implement storage cleanup
  }

  private async refreshCDN() {
    // Implement CDN refresh
  }

  // ... rest of the implementation
}

export const healthCheck = HealthCheck.getInstance();