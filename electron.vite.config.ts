import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: { index: 'electron/main.ts' },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: { index: 'electron/preload.ts' },
      },
    },
  },
  renderer: {
    root: 'ui',
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        input: 'ui/index.html',
      },
    },
  },
})
