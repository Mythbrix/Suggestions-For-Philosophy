import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // ১. এখানে আপনার ফন্ট ফাইলটির নাম নিশ্চিত করুন
      includeAssets: ['Kalpurush.ttf', 'favicon.ico', 'apple-touch-icon.png'],
      workbox: {
        // ২. সব ফাইল এবং বড় সাইজের ফন্ট ক্যাশ করার জন্য গ্লোব প্যাটার্ন
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,ttf}'],
        // ৩. বড় ফন্ট ফাইল ক্যাশ করার জন্য লিমিট বাড়িয়ে ১০ মেগাবাইট করা হলো
        maximumFileSizeToCacheInBytes: 10000000, 
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // ৪. ফন্ট ফাইলগুলোর জন্য আলাদা ক্যাশিং রুল
            urlPattern: /\.(?:ttf|woff|woff2)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'offline-fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // ১ বছর সেভ থাকবে
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
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
