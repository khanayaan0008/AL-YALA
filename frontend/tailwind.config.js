/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          dark: '#2B3A29',
          light: '#FDFBF7',
          border: '#ECE5D8',
          subtle: '#E8E2D5'
        }
      }
    },
  },
  plugins: [],
};