import { analytics } from './analytics';

// Performance monitoring
export const monitoring = {
  // Track page load performance
  trackPageLoad() {
    if (window.performance) {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      analytics.trackPerformance('page_load', pageLoadTime);
    }
  },

  // Track API response times
  trackApiCall(endpoint: string, duration: number) {
    analytics.trackPerformance(`api_${endpoint}`, duration);
  },

  // Track client-side errors
  trackError(error: Error, context?: Record<string, any>) {
    analytics.trackError(error, context);
  },

  // Track resource loading
  trackResourceTiming() {
    if (window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType('resource');
      resources.forEach(resource => {
        if (resource instanceof PerformanceResourceTiming) {
          analytics.trackPerformance(
            `resource_${resource.initiatorType}`,
            resource.duration
          );
        }
      });
    }
  }
};