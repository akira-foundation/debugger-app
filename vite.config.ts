import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: 'public',
  server: {
    strictPort: true,
  },
  build: {
    target: 'ES2020',
    minify: 'esbuild',
  },
})
