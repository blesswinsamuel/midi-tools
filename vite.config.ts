import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// import manifest from './public/manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
