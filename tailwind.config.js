/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mairie: {
          brown: '#3E2723',
          ink: '#2A1B18',
          gold: '#D4AF37',
          goldSoft: '#F7EDC8',
          goldDeep: '#6F5608',
          lagoon: '#0B5A8C',
          lagoonDeep: '#0A3C5C',
          lagoonSoft: '#E4EEF4',
          mist: '#F2F5F6',
          line: '#D6DFE3',
          muted: '#4B5A60',
          orange: '#F77F00',
          green: '#00834F',
          // Anciens noms conservés pour compatibilité
          lagoonText: '#0B5A8C',
          paper: '#F2F5F6',
        },
      },
      fontFamily: {
        serif: ['Literata', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['"Public Sans"', 'system-ui', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        page: '72rem',
      },
      fontSize: {
        xs: ['1rem', { lineHeight: '1.25rem' }],
        sm: ['1rem', { lineHeight: '1.5rem' }],
      },
    },
  },
  plugins: [],
};
