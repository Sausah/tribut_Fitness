import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/v3/',
  plugins: [react()],
  server: {
    port: 5176,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5176,
    }
  }
})
