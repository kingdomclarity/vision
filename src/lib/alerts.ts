import { analytics } from './analytics';
import { db } from './db';

type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';
type AlertChannel = 'email' | 'slack' | 'sms';

interface Alert {
  id: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  data?: any;
  timestamp: Date;
}

class AlertSystem {
  private static instance: AlertSystem;
  private alerts: Alert[] = [];
  private alertChannels: Record<AlertSeverity, AlertChannel[]> = {
    info: ['email'],
    warning: ['email', 'slack'],
    error: ['email', 'slack', 'sms'],
    critical: ['email', 'slack', 'sms']
  };

  private constructor() {
    if (import.meta.env.PROD) {
      this.initializeAlertSystem();
    }
  }

  static getInstance(): AlertSystem {
    if (!AlertSystem.instance) {
      AlertSystem.instance = new AlertSystem();
    }
    return AlertSystem.instance;
  }

  // ... rest of the class implementation stays the same
}

export const alertSystem = AlertSystem.getInstance();