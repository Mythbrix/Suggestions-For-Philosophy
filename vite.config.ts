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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'], // বিল্ড হওয়া সব ফাইল ক্যাশ করবে
        navigateFallback: '/index.html', // PWABuilder কে অফলাইন স্ক্রিন দেখাতে বাধা দেবে
        cleanupOutdatedCaches: true
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
