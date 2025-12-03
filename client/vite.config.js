import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      isProduction &&
        VitePWA({
          registerType: 'prompt',
          workbox: {
            globPatterns: ['**/*.{js,css,html,png,svg}'],
            runtimeCaching: [
              {
                urlPattern: ({ request }) => request.destination === 'image',
                handler: 'CacheFirst',
                options: {
                  cacheName: 'images-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
                  },
                },
              },
              {
                urlPattern: ({ url, request }) =>
                  request.method === 'GET' &&
                  (url.pathname.startsWith('/api/workouts') ||
                    url.pathname.startsWith('/api/exercises') ||
                    url.pathname.startsWith('/api/weight') ||
                    url.pathname.startsWith('/api/bodyfat') ||
                    url.pathname.startsWith('/api/health')),
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'api-cache',
                  networkTimeoutSeconds: 5,
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 24 * 60 * 60, // 1 day
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
            ],
          },
          manifest: {
            name: 'FitLog',
            short_name: 'FitLog',
            description: 'Your personal AI fitness tracker',
            theme_color: '#007bff',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: '/',
            icons: [
              {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable',
              },
              {
                src: '/icon-256x256.png',
                sizes: '256x256',
                type: 'image/png',
              },
              {
                src: '/icon-384x384.png',
                sizes: '384x384',
                type: 'image/png',
              },
              {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
              },
            ],
          },
        }),
    ].filter(Boolean), // Filter out false values when not in production
  };
});
