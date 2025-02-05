/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#475569',
      }
    },
  },
  plugins: [],
}