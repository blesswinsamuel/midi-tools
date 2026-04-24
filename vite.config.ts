import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// import manifest from './public/manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    // eslint({
    //   // include: 'src/**/*.{js,ts,tsx,jsx}',
    //   // cache: false,
    // }),
  ],

  define: {
    'process.env': {},
  },

  // build: {
  //   sourcemap: true,
  // },
})
