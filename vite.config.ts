import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['jeep-sqlite']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  plugins: [
    react(),
  ]
})