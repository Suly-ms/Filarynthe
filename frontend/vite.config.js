import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 15372,
    strictPort: true,
  },
  preview: {
    port: 15372,
    strictPort: true,
    allowedHosts: true, // Allows all hosts (e.g. duckdns.org)
  }
})
