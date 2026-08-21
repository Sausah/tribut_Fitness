import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/v4/',
  plugins: [react()],
  server: {
    port: 5177,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5177,
    }
  }
})
