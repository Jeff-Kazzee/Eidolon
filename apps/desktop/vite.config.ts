import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import { resolve } from 'path'

const isDev = process.env.NODE_ENV !== 'production'

// https://vitejs.dev/config/
export default defineConfig({
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
    // HMR configuration
    hmr: {
      // Use WebSocket for HMR communication
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      // Show overlay for runtime errors
      overlay: true,
    },
    // Watch configuration for faster updates
    watch: {
      // Use polling on Windows for better reliability
      usePolling: process.platform === 'win32',
      interval: 100,
    },
  },
  // Optimize dependency pre-bundling for faster dev startup
  optimizeDeps: {
    include: ['react', 'react-dom'],
    // Force re-optimization when these files change
    entries: ['./src/main.tsx'],
  },
})
