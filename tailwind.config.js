/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#F3F0FF',
          100: '#E9E3FF',
          500: '#7B68EE',
          600: '#6A5ACD',
          700: '#7B68EE',
        }
      },
    },
  },
  plugins: [],
}

