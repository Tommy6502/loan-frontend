import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'loan-frontend-hhls.onrender.com'
    ],
    host: true
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  }
});
