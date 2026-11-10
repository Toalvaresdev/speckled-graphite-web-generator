/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#090a0d',
          900: '#111318',
          850: '#161920',
          800: '#1e222b',
          700: '#2a303c',
          600: '#3d4554',
          500: '#586275',
          400: '#818d9f',
          300: '#abb5c4',
          200: '#d5dae2',
          100: '#f0f2f5',
        },
        accent: {
          DEFAULT: '#f97316',
          hover: '#ea580c',
          glow: 'rgba(249, 115, 22, 0.35)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(249, 115, 22, 0.25)',
        'studio': '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
