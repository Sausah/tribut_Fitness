import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/v2': {
        target: 'http://localhost:5175',
        changeOrigin: true,
        ws: true,
      },
      '/v3': {
        target: 'http://localhost:5176',
        changeOrigin: true,
        ws: true,
      },
      '/v4': {
        target: 'http://localhost:5177',
        changeOrigin: true,
        ws: true,
      },
    }
  }
})
