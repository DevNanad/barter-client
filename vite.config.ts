import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import pluginRewriteAll from 'vite-plugin-rewrite-all';

export default defineConfig({
  plugins: [react(), svgr(),pluginRewriteAll()],
  server: {
    port: 3001
  }
})
