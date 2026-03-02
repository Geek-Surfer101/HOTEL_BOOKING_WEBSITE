/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'outfit': ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
      spacing: {
        '70': '17.5rem',
        '130': '32.5rem',
        '174': '43.5rem',
      },
      maxWidth: {
        '70': '17.5rem',
        '130': '32.5rem',
        '174': '43.5rem',
      },
    },
  },
  plugins: [],
}
