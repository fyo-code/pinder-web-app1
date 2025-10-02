import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FF2E86',
          pinkLight: '#FFD1E6',
          grayBg: '#F7F7FA',
          grayCard: '#FFFFFF',
        },
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 10px 25px rgba(16,24,40,0.08)',
      },
    },
  },
  plugins: [],
}
export default config