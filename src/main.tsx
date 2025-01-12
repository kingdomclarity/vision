import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { register as registerServiceWorker } from './lib/serviceWorkerRegistration';
import { monitoring } from './lib/monitoring';
import { healthCheck } from './lib/healthCheck';
import './index.css';

// Initialize monitoring
monitoring.trackPageLoad();

// Start health checks in production
if (import.meta.env.PROD) {
  healthCheck.startHealthChecks();
}

// Mount the app
const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker in production
if (import.meta.env.PROD) {
  registerServiceWorker();
}