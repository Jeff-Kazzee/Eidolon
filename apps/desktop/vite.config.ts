import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Use Vite's command/mode for accurate dev detection
  // command === 'serve' for dev server, 'build' for production
  const isDev = command === 'serve' || mode !== 'production'

  // Allow env override for polling (useful for network drives or WSL)
  const usePolling = process.env.VITE_USE_POLLING === 'true'

  return {
    plugins: [
      // React Fast Refresh for HMR
      react({
        // Enable Fast Refresh in development
        fastRefresh: isDev,
      }),
      electron([
        {
          // Main process entry point
          entry: 'electron/main.ts',
          onstart(options) {
            // Restart Electron when main process changes
            if (isDev) {
              console.log('[electron] Main process updated, restarting...')
            }
            options.startup()
          },
          vite: {
            build: {
              outDir: 'dist-electron',
              sourcemap: isDev ? 'inline' : false,
              minify: !isDev,
              rollupOptions: {
                external: ['electron'],
              },
            },
          },
        },
        {
          // Preload script entry point
          entry: 'electron/preload.ts',
          onstart(options) {
            // Notify the renderer process to reload when preload script changes
            if (isDev) {
              console.log('[electron] Preload script updated, reloading renderer...')
            }
            options.reload()
          },
          vite: {
            build: {
              outDir: 'dist-electron',
              sourcemap: isDev ? 'inline' : false,
              minify: !isDev,
              rollupOptions: {
                external: ['electron'],
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
      // HMR inherits host/port from server config automatically
      hmr: {
        // Show overlay for runtime errors in dev
        overlay: true,
      },
      // Watch configuration
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
