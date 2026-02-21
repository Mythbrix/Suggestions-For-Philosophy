import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'], // সব ফাইল ক্যাশ করবে
        maximumFileSizeToCacheInBytes: 5000000, // 5MB পর্যন্ত সাইজ লিমিট (যাতে বড় ফাইল মিস না হয়)
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // JS এবং CSS ফাইলগুলো অফলাইনে ক্যাশ ফাস্ট (CacheFirst) লোড হবে
            urlPattern: /\.(?:js|css)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // ৩০ দিন
              },
            },
          },
          {
            // ইমেজ ফাইলগুলো ক্যাশ ফাস্ট
            urlPattern: /\.(?:png|jpg|jpeg|svg|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          }
        ]
      },
      manifest: {
        name: "NU Suggestion 2026",
        short_name: "NU Suggestion",
        start_url: "/",
        display: "standalone",
        background_color: "#1e293b",
        theme_color: "#8b5cf6",
        orientation: "portrait-primary",
        icons: [
          {
            src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjExMiIgZmlsbD0iIzhiNWNmNiIvPjxwYXRoIGQ9Ik0xNjAgMTQ0Yy0yNi41IDAtNDggMjEuNS00OCA0OHYxOTJjMCAyNi41IDIxLjUgNDggNDggNDhoMjI0VjE0NEgxNjB6bTE5MiAyNDBIMTYwYy04LjggMC0xNi03LjItMTYtMTZzNy4yLTE2IDE2LTE2aDE5MnYzMnoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      }
    })
  ]
});
