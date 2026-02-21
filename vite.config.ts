import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-root-assets',
      closeBundle() {
        try {
          fs.copyFileSync('sw.js', 'dist/sw.js');
          fs.copyFileSync('manifest.json', 'dist/manifest.json');
          fs.copyFileSync('metadata.json', 'dist/metadata.json');
        } catch (e) {
          console.warn("Failed to copy root assets. Ensure they exist.");
        }
      }
    }
  ],
  publicDir: false // Disable public folder strictly
});
