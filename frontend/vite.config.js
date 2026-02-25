import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const REPO_NAME = 'ordermade';


// https://vite.dev/config/
export default defineConfig({
  base: '/ordermade/',
  plugins: [react(),tailwindcss(),],
})
