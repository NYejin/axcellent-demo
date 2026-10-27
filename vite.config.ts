import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// 백엔드 없이 도는 데모라 프록시가 없다. API 응답은 src/mock이 녹화본으로 대신한다.
// GitHub Pages(https://<id>.github.io/axcellent-demo/)용 빌드는 `npm run build:pages`가 base를 /axcellent-demo/로 바꾼다.
export default defineConfig({
  base: process.env.DEMO_BASE ?? '/',
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 3090, strictPort: true },
  preview: { port: 3090, strictPort: true },
})
