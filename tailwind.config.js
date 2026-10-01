/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          900: '#070C18',
          800: '#0B132B',
          700: '#1C2541',
          600: '#2A3B60',
          500: '#3A506B',
        },
        hazard: {
          critical: '#EF4444',
          high: '#F97316',
          medium: '#EAB308',
          low: '#10B981',
          cyan: '#06B6D4',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
