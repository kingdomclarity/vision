import { analytics } from './analytics';

type Metric = {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
};

type Transaction = {
  name: string;
  startTime: number;
  endTime?: number;
  metrics: Metric[];
};

class Monitoring {
  private static instance: Monitoring;
  private transactions: Map<string, Transaction> = new Map();
  private metrics: Metric[] = [];
  private errorCount = 0;
  private maxErrors = 1000;

  private constructor() {
    this.setupPerformanceObserver();
  }

  private setupPerformanceObserver() {
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackPerformanceEntry(entry);
        }
      });

      observer.observe({ 
        entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint'] 
      });
    }
  }

  startTransaction(name: string) {
    this.transactions.set(name, {
      name,
      startTime: performance.now(),
      metrics: []
    });
  }

  endTransaction(name: string) {
    const transaction = this.transactions.get(name);
    if (transaction) {
      transaction.endTime = performance.now();
      this.analyzeTransaction(transaction);
    }
  }

  private analyzeTransaction(transaction: Transaction) {
    const duration = transaction.endTime! - transaction.startTime;
    
    // Track transaction duration
    this.addMetric({
      name: `${transaction.name}_duration`,
      value: duration,
      unit: 'ms',
      timestamp: Date.now()
    });

    // Analyze metrics
    if (duration > 1000) { // 1 second threshold
      analytics.trackEvent('slow_transaction', {
        transaction: transaction.name,
        duration,
        metrics: transaction.metrics
      });
    }
  }

  addMetric(metric: Metric) {
    this.metrics.push(metric);
    this.analyzeMetrics();
  }

  private analyzeMetrics() {
    // Implement metric analysis
    // Example: Check for performance anomalies
  }

  captureError(error: Error, context?: Record<string, any>) {
    if (this.errorCount >= this.maxErrors) {
      console.warn('Error limit reached');
      return;
    }

    this.errorCount++;
    analytics.trackError(error, context);
  }

  // ... rest of the implementation
}

export const monitoring = Monitoring.getInstance();