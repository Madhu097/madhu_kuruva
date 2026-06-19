/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#111111',
        card: '#1C1C1E',
        primaryText: '#F5F5F7',
        secondaryText: '#86868B',
        border: '#2C2C2E',
        accent: '#0A84FF',
        accentHover: '#409CFF',
      },
    },
  },
  plugins: [],
};
