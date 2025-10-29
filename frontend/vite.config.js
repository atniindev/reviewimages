import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const port = Number(process.env.VITE_FRONTEND_PORT) || 3000

  return {
    plugins: [react()],
    server: {
      host: true,
      port: port,
    },
    build: {
      outDir: 'dist',
    },
  }
})
