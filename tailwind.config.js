/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nav-bg': '#0f4c75',
        'page-bg': '#F5FAFF',
        'button-bg':'#0284c7',




        'mist-blue': '#B4D9E4',
        'text-blue': '#0e7490',
        'hover-blue': "#155e75",
      },
    },
  },
  plugins: [],
}
