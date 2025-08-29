import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  
  
  plugins: [
    vue(),
    VueDevTools(),
    // PWA Plugin רק ב-production
    ...(mode === 'production' ? [
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          id: '/',
          name: "Morena's Food List",
          short_name: "Morena's Food List",
          description: "A grocery list app for Morena - manage your shopping lists easily",
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          orientation: 'portrait',
          icons: [
            {
              src: 'android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ] : [])
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
}));
