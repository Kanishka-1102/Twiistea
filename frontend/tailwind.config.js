/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f3',
          100: '#dcede4',
          200: '#bcdcca',
          300: '#8ec3a8',
          400: '#5ea382',
          500: '#3d8564',
          600: '#2d6b50',
          700: '#255641',
          800: '#1a4a2e',
          900: '#163d27',
          950: '#0b2217',
        },
        gold: {
          50: '#fdf8ee',
          100: '#f9edce',
          200: '#f3d998',
          300: '#ebbf5e',
          400: '#e4a832',
          500: '#c8922a',
          600: '#b07420',
          700: '#8e561d',
          800: '#74451e',
          900: '#613a1d',
        },
        cream: {
          50: '#fdfcf9',
          100: '#f9f5ee',
          200: '#f5f0e8',
          300: '#ede4d3',
          400: '#ddd0b5',
        },
        tea: {
          dark: '#2c1810',
          medium: '#5c3d2e',
          light: '#8b6355',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        'tea': '0 4px 20px rgba(26, 74, 46, 0.15)',
        'gold': '0 4px 20px rgba(200, 146, 42, 0.25)',
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
