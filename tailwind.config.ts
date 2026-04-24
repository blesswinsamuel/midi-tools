import { Config } from 'tailwindcss'
import tailwindForms from '@tailwindcss/forms'
import tailwindColors from 'tailwindcss/colors'

// Credit: https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/
const systemFonts = ['-apple-system', 'system-ui', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto']
const fallbackFonts = ['Helvetica Neue', 'sans-serif']
const sansFallbackFonts = [...systemFonts, ...fallbackFonts]
const { sansFont, monoFont } = {
  sansFont: ['IBM Plex Sans', ...sansFallbackFonts],
  monoFont: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '.bp5-dark'],
  theme: {
    fontFamily: {
      sans: sansFont,
      mono: monoFont,
    },
    extend: {
      colors: {
        gray: tailwindColors.neutral,
        primary: '#B1E55A',
      },
      boxShadow: {
        outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
      },
      // margin: {
      //   '96': '24rem',
      //   '128': '32rem',
      // },
    },
  },
  plugins: [
    tailwindForms({
      strategy: 'class',
    }),
  ],
} satisfies Config
