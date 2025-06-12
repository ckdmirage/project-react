/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: ['bg-mist-blue','text-rice-white'],
  theme: {
    extend: {
      colors: {
        'sky-blue': '#D9F2F2',
        'mist-blue': '#81C0C0',
        'text-blue': '#0e7490',
        'hover-blue': "#155e75",
        'rice-white':'#FAF5F0'
      },
    },
  },
  plugins: [],
}
