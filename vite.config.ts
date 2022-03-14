import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  // vitest config
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  define: {
    chrome: {
      runtime: {
        id: 'test-id',
      },
    },
  },
})
