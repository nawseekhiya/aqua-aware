/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        '300': '300ms',
      },
      transitionTimingFunction: {
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'blue-sm': '0 1px 2px 0 rgba(0, 102, 255, 0.05)',
        'blue-md': '0 4px 6px -1px rgba(0, 102, 255, 0.1), 0 2px 4px -1px rgba(0, 102, 255, 0.06)',
        'blue-lg': '0 10px 15px -3px rgba(0, 102, 255, 0.1), 0 4px 6px -2px rgba(0, 102, 255, 0.05)',
        'blue-xl': '0 20px 25px -5px rgba(0, 102, 255, 0.1), 0 10px 10px -5px rgba(0, 102, 255, 0.04)',
      },
      colors: {
        blue: {
          400: '#4D94FF',
          600: '#0066FF',
        },
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
      },
    },
  },
  plugins: [],
};