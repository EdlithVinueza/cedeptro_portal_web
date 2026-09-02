/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cedepro: {
          navy: '#091E3A',
          navyDark: '#061528',
          gold: '#f5a623',
          goldDark: '#c1911e',
          mustard: '#b8860b',
          charcoal: '#1e2229',
          lightBg: '#f8f9fa',
          darkText: '#1a1a1a',
          bodyText: '#4a4a4a',
          grayBorder: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        heading: ['Kanit', 'Poppins', 'sans-serif'],
        cursive: ['Playfair Display', 'Georgia', 'serif'],
        signature: ['Herr Von Muellerhoff', 'cursive'],
      }
    },
  },
  plugins: [],
}
