import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        navigateFallback: '/index.html', // এটি ওই অফলাইন স্ক্রিনটা আসা বন্ধ করবে
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
            handler: 'CacheFirst', // ইন্টারনেট না থাকলেও ক্যাশ থেকে লোড করবে
            options: {
              cacheName: 'tailwind-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },
      manifest: {
        name: "NU Suggestion 2026",
        short_name: "NU Suggestion",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#8b5cf6",
        orientation: "portrait-primary",
        icons: [
          { src: "https://cdn-icons-png.flaticon.com/512/3429/3429149.png", sizes: "192x192", type: "image/png" },
          { src: "https://cdn-icons-png.flaticon.com/512/3429/3429149.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ]
});
