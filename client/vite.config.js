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
          registerType: 'autoUpdate',
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
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          },
        }),
    ].filter(Boolean), // Filter out false values when not in production
  };
});
