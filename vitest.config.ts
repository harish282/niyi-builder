import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@niyi-builder/core': resolve(__dirname, 'builder/core/src/index.ts'),
      '@niyi-builder/serializer': resolve(__dirname, 'builder/serializer/src/index.ts'),
      '@niyi-builder/elements': resolve(__dirname, 'builder/elements/src/index.ts'),
    },
  },
  test: {
    include: ['builder/**/*.test.ts', 'builder/**/*.test.tsx'],
  },
});
