import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

process.env.BROWSERSLIST_CONFIG = '.browserslistrc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist', 'pdf-lib']
  },
  server: {
    port: 3000,
    open: false
  }
});
