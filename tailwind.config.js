/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FFF3DD', // Warm cream
          200: '#F8E7CB', // Light beige
          300: '#EDD4AE',
          400: '#DFBE8E',
          500: '#CCA368',
        },
        maroon: {
          700: '#9B302A', // Dark red
          800: '#7B211F', // Deep maroon
          900: '#5A1715',
          950: '#3D0D0B',
        },
        gold: {
          300: '#E6C47C',
          400: '#D7AE5D',
          500: '#C69A45', // Antique gold
          600: '#A87D2E',
          700: '#8A621C',
        },
        traditional: {
          brown: '#553322', // Brown
          deepMaroon: '#7B211F',
          darkRed: '#9B302A',
          antiqueGold: '#C69A45',
          warmCream: '#FFF3DD',
          lightBeige: '#F8E7CB',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Marcellus"', 'Georgia', 'serif'],
        heading: ['"Rozha One"', '"Cinzel Decorative"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'kolam-pattern': "radial-gradient(#C69A45 0.75px, transparent 0.75px), radial-gradient(#C69A45 0.75px, #FFF3DD 0.75px)",
      }
    },
  },
  plugins: [],
}
