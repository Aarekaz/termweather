import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'node18',
  outDir: 'dist',
  // Bundle all dependencies for standalone distribution
  noExternal: [/@weather\/.*/],
  // Don't bundle these - they're runtime dependencies
  external: ['ink', 'react', 'chalk', 'commander'],
});
