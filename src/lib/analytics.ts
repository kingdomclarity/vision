type EventProperties = Record<string, any>;

class Analytics {
  private static instance: Analytics;
  
  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  trackEvent(eventName: string, properties?: EventProperties) {
    // Implement analytics tracking
    console.log('Track event:', eventName, properties);
  }

  trackError(error: Error, context?: Record<string, any>) {
    // Track errors in monitoring service
    console.error('Error:', error, context);
  }

  trackPageView(path: string) {
    // Track page views
    console.log('Page view:', path);
  }

  trackPerformance(metric: string, value: number) {
    // Track performance metrics
    console.log('Performance:', metric, value);
  }
}

export const analytics = Analytics.getInstance();