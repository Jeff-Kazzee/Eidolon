import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // command === 'serve' for dev server, 'build' for production
  const isDev = command === 'serve'

  // Allow env override for polling (useful for network drives or WSL)
  const usePolling = process.env.VITE_USE_POLLING === 'true'

  return {
    plugins: [
      // React plugin (Fast Refresh enabled by default in dev)
      react(),
      electron([
        {
          // Main process entry point
          entry: 'electron/main.ts',
          onstart(options) {
            options.startup()
          },
          vite: {
            build: {
              outDir: 'dist-electron',
              sourcemap: isDev ? 'inline' : false,
              minify: !isDev,
              rollupOptions: {
                external: ['electron', 'better-sqlite3'],
              },
            },
          },
        },
        {
          // Preload script entry point
          entry: 'electron/preload.ts',
          onstart(options) {
            options.reload()
          },
          vite: {
            build: {
              outDir: 'dist-electron',
              sourcemap: isDev ? 'inline' : false,
              minify: !isDev,
              rollupOptions: {
                external: ['electron', 'better-sqlite3'],
              },
            },
          },
        },
      ]),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: isDev,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      // Watch configuration (polling opt-in for network drives/WSL)
      watch: usePolling
        ? {
            // Polling mode for network drives, WSL, or problematic file systems
            usePolling: true,
            interval: 300,
          }
        : undefined,
    },
  }
})
