import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

process.env.BROWSERSLIST_CONFIG = '.browserslistrc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist', 'pdf-lib', 'lucide-react', 'canvas-confetti'],
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-core': ['pdf-lib', 'pdfjs-dist'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
