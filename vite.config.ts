import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // অটোমেটিক আপডেট হবে
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'], // আপনার সব ফাইল ক্যাশ করবে
        runtimeCaching: [
          {
            // Tailwind CSS অফলাইনে কাজ করানোর জন্য
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tailwind-cdn-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // আইকন অফলাইনে কাজ করানোর জন্য
            urlPattern: /^https:\/\/cdn-icons-png\.flaticon\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'icon-cache',
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
          {
            src: "https://cdn-icons-png.flaticon.com/512/3429/3429149.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "https://cdn-icons-png.flaticon.com/512/3429/3429149.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});
