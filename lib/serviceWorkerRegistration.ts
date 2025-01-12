import { analytics } from './analytics';

export function register() {
  // Skip service worker registration in WebContainer environment
  if (window.location.hostname === 'stackblitz.com' || 
      window.location.hostname.includes('stackblitz.io')) {
    console.log('Service Workers are not supported in StackBlitz WebContainer environment');
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          analytics.trackEvent('service_worker_registered', {
            scope: registration.scope
          });
        })
        .catch(error => {
          analytics.trackError(error, {
            context: 'service_worker_registration'
          });
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
        analytics.trackEvent('service_worker_unregistered');
      })
      .catch(error => {
        analytics.trackError(error, {
          context: 'service_worker_unregistration'
        });
      });
  }
}