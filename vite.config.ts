import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['agora-rtc-sdk-ng']
  },
  build: {
    commonjsOptions: {
      include: [/agora-rtc-sdk-ng/]
    }
  }
});