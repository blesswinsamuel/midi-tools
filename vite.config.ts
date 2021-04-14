import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import eslintPlugin from 'vite-plugin-eslint'
// import manifest from './public/manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslintPlugin({
      include: 'src/**/*.{js,ts,tsx,jsx}',
      cache: false,
    }),
    reactRefresh(),
  ],
  define: {
    'process.env': {},
  },

  // build: {
  //   sourcemap: true,
  // },
})
