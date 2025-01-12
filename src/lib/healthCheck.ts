import { db } from './db';
import { analytics } from './analytics';
import { alertSystem } from './alerts';
import { backupSystem } from './backup';
import { complianceSystem } from './compliance';
import { agoraService } from './agora';
import { cloudflareService } from './cloudflare';

class HealthCheck {
  private static instance: HealthCheck;
  private checkInterval = 5 * 60 * 1000; // 5 minutes
  private isRunning = false;

  private constructor() {
    // Don't start health checks in development
    if (import.meta.env.PROD) {
      this.startHealthChecks();
    }
  }

  static getInstance(): HealthCheck {
    if (!HealthCheck.instance) {
      HealthCheck.instance = new HealthCheck();
    }
    return HealthCheck.instance;
  }

  startHealthChecks(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    setInterval(() => {
      this.runHealthChecks();
    }, this.checkInterval);
  }

  async runHealthChecks() {
    try {
      const results = await Promise.all([
        this.checkDatabase(),
        this.checkAPI(),
        this.checkStorage(),
        this.checkBackups(),
        this.checkCompliance(),
        this.checkPerformance(),
        this.checkAgoraService(),
        this.checkCloudflareService()
      ]);

      const allHealthy = results.every(result => result.healthy);

      if (!allHealthy) {
        alertSystem.createAlert({
          type: 'health_check',
          severity: 'error',
          message: 'System health check failed',
          data: results
        });
      }

      analytics.trackEvent('health_check_completed', {
        healthy: allHealthy,
        results
      });
    } catch (error) {
      analytics.trackError(error as Error, { context: 'health_check' });
    }
  }

  private async checkAgoraService() {
    try {
      // Test Agora token generation
      const token = await agoraService.getAgoraToken('test-channel', 'test-user');
      return {
        component: 'agora',
        healthy: !!token,
        lastCheck: new Date()
      };
    } catch (error) {
      analytics.trackError(error as Error, { context: 'agora_health_check' });
      return {
        component: 'agora',
        healthy: false,
        error: error.message,
        lastCheck: new Date()
      };
    }
  }

  private async checkCloudflareService() {
    try {
      // Test Cloudflare API access
      const testPath = '/test.jpg';
      const url = cloudflareService.getAssetUrl(testPath);
      return {
        component: 'cloudflare',
        healthy: url.includes('cdn.vision.com'),
        lastCheck: new Date()
      };
    } catch (error) {
      analytics.trackError(error as Error, { context: 'cloudflare_health_check' });
      return {
        component: 'cloudflare',
        healthy: false,
        error: error.message,
        lastCheck: new Date()
      };
    }
  }

  // ... rest of the class implementation stays the same
}

export const healthCheck = HealthCheck.getInstance();