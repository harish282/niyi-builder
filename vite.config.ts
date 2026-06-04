import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const DEV_PORT = 5173;
const DEV_ORIGIN = `http://localhost:${DEV_PORT}`;

export default defineConfig(({ command }) => ({
  plugins: [react()],
  root: resolve(__dirname, 'admin'),
  base: command === 'serve' ? `${DEV_ORIGIN}/` : './',
  build: {
    outDir: resolve(__dirname, 'build'),
    emptyOutDir: true,
    manifest: 'manifest.json',
    rollupOptions: {
      input: {
        admin: resolve(__dirname, 'admin/src/main.tsx'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  resolve: {
    alias: {
      '@niyi-builder/core': resolve(__dirname, 'packages/core/src/index.ts'),
    },
  },
  server: {
    port: DEV_PORT,
    strictPort: true,
    origin: DEV_ORIGIN,
    cors: true,
  },
}));
