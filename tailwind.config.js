/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uno: '#f8f7ff',
        dos: '#9381FF',
        tres: '#B8B8FF',
        quatro: '#FFEEDD',
        singko: '#FFD8BE'
      }
    },
  },
  plugins: [],
}

