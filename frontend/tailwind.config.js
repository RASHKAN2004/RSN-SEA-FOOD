/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        sea: {
          50: '#eefbfa',
          100: '#d4f4f1',
          200: '#aae8e2',
          300: '#75d5cc',
          400: '#42b9ae',
          500: '#249c92',
          600: '#1a7d76',
          700: '#186460',
          800: '#17504e',
          900: '#164342',
          950: '#082625',
        },
        coral: {
          50: '#fff6ed',
          100: '#ffead4',
          200: '#ffd1a8',
          300: '#ffb070',
          400: '#ff8637',
          500: '#fd6612',
          600: '#ee4a08',
          700: '#c53509',
          800: '#9c2b10',
          900: '#7e2610',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(8, 38, 37, 0.12)',
        floating: '0 8px 30px rgba(8, 38, 37, 0.25)',
      },
    },
  },
  plugins: [],
};
