/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy ink — the bank's primary surface/text color
        ink: {
          50: '#f4f6f9',
          100: '#e6eaf1',
          200: '#c9d2e0',
          400: '#5b6b85',
          600: '#27344a',
          700: '#1a2436',
          800: '#121a28',
          900: '#0b1220'
        },
        // Muted gold — the single accent reserved for emphasis & the signature rule
        gold: {
          400: '#d9b65b',
          500: '#c79a3f',
          600: '#a87c2e'
        },
        brand: {
          50: '#eef3fb',
          100: '#d8e4f4',
          500: '#2f5d8a',
          600: '#234a72',
          700: '#1a3a5c',
          900: '#0b1220'
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: []
}
