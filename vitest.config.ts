import {defineConfig} from 'vitest/config';

module.exports = defineConfig(async ({ command, mode }) => {
    const { svelte } = await import('@sveltejs/vite-plugin-svelte');
    return {
      plugins: [svelte()],
      test: {
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        globals: true,
        environment: 'jsdom',
        coverage: {
          provider: 'c8',
          reporter: ['text', 'json'],
        },
      },
  }
});