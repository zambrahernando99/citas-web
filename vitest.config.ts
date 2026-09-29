import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Configuración solo para pruebas; vite.config.ts (build/dev) no cambia.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    env: { VITE_API_URL: 'http://api.test' },
  },
});
