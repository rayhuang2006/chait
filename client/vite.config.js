import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 讓前端在開發模式代理到後端 API
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:4091'
    }
  }
});
