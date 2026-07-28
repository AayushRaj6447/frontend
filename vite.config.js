import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/users': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/donors': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/bloodrequests': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
