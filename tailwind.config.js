/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FAF6E9',
          100: '#F5EDD3',
          200: '#E6D7AA',
          300: '#D7C182',
          400: '#C5B17F',
          500: '#B39B59',
          600: '#997F3D',
          700: '#7A6431',
          800: '#5C4B25',
          900: '#3D3219',
        },
      },
    },
  },
  plugins: [],
};