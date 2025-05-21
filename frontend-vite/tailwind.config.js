/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#181818",
        orange: "#ff8800",
        "orange-dark": "#cc6e00",
        "gray-dark": "#232323",
      },
    },
  },
  plugins: [],
}