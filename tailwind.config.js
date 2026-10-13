/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#0A0A0A',
        card: '#111111',
        primaryText: '#F5F5F7',
        secondaryText: '#86868B',
        border: '#222222',
        accent: '#FFFFFF',
        accentHover: '#E0E0E0',
      },
      fontFamily: {
        heading: ['"Fraunces"', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        syne: ['"Fraunces"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};