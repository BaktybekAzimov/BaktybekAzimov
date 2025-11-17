/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // KELECHEK №27
        kelechek: {
          bg: '#F5F5F5',
          primary: '#C8102E',
          dark: '#2C3E50',
          white: '#FFFFFF',
          text: '#1A1A1A',
          gray: '#6C757D',
        },

        // ADYGENE
        adygene: {
          primary: '#4A90B5',
          light: '#E0F7FF',
          mint: '#00BFA5',
          white: '#FFFFFF',
          text: '#1E3A8A',
          ice: '#B3E5FC',
        },

        // KARA-SHORO
        karashoro: {
          bg: '#FFFFFF',
          red: '#C8102E',
          blue: '#5DADE2',
          mountains: '#34495E',
        },

        // GIMALAI
        gimalai: {
          primary: '#87CEEB',
          light: '#E0F7FF',
          dark: '#1E5F8F',
          white: '#FFFFFF',
          aqua: '#00CED1',
        },

        // ЛИМОНАДЫ
        lemonad: {
          yellow: '#FFD700',
          wave: '#2C5F2D',
          kt: '#5DADE2',
        },
        buratino: {
          orange: '#FF8C00',
          light: '#FFA500',
        },
        tarhun: {
          green: '#98FB98',
          dark: '#228B22',
        },
        duchess: {
          orange: '#FF6347',
          yellow: '#FFD700',
        },
        kplus: {
          green: '#7CFC00',
          liquid: '#E0FFE0',
          lime: '#32CD32',
        },
        asiacola: {
          dark: '#1A1A1A',
          red: '#DC143C',
          brown: '#4A2511',
        },
        granat: {
          red: '#DC143C',
          dark: '#8B0000',
        },
        citro: {
          orange: '#FFA500',
          yellow: '#FFD700',
        },
      },

      fontFamily: {
        primary: ['Bebas Neue', 'sans-serif'],
        secondary: ['Montserrat', 'sans-serif'],
      },

      fontSize: {
        'hero': ['96px', { lineHeight: '1.1', letterSpacing: '0.05em' }],
        'display': ['72px', { lineHeight: '1.1', letterSpacing: '0.03em' }],
        'h1': ['60px', { lineHeight: '1.2' }],
        'h2': ['48px', { lineHeight: '1.3' }],
        'h3': ['36px', { lineHeight: '1.3' }],
        'h4': ['24px', { lineHeight: '1.4' }],
      },

      boxShadow: {
        'premium': '0 10px 40px rgba(44, 62, 80, 0.15)',
        'ice': '0 8px 32px rgba(74, 144, 181, 0.2)',
        'soft': '0 0 20px rgba(135, 206, 235, 0.3)',
        'glow-red': '0 0 20px rgba(200, 16, 46, 0.4), 0 0 40px rgba(200, 16, 46, 0.2)',
        'glow-ice': '0 0 30px rgba(224, 247, 255, 0.6), 0 0 60px rgba(74, 144, 181, 0.3)',
      },

      backgroundImage: {
        'kelechek-hero': 'linear-gradient(135deg, #2C3E50 0%, #1A1A1A 100%)',
        'kelechek-subtle': 'linear-gradient(180deg, #F5F5F5 0%, #FFFFFF 100%)',
        'adygene-cold': 'linear-gradient(135deg, #E0F7FF 0%, #4A90B5 100%)',
        'adygene-ice': 'linear-gradient(180deg, #FFFFFF 0%, #E0F7FF 50%, #4A90B5 100%)',
        'gimalai-water': 'linear-gradient(135deg, #E0F7FF 0%, #87CEEB 100%)',
        'buratino': 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
        'tarhun': 'linear-gradient(135deg, #98FB98 0%, #228B22 100%)',
        'duchess': 'linear-gradient(135deg, #FFD700 0%, #FF6347 100%)',
        'kplus': 'linear-gradient(135deg, #E0FFE0 0%, #7CFC00 100%)',
        'granat': 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
        'citro': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      },

      animation: {
        'float': 'float 3s ease-in-out infinite',
        'drop': 'drop 2s ease-in forwards',
        'ripple': 'ripple 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-soft': 'bounce-soft 1s ease-in-out',
        'wave': 'wave 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drop: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 5px rgba(200, 16, 46, 0.5), 0 0 10px rgba(200, 16, 46, 0.3)',
          },
          '100%': {
            boxShadow: '0 0 20px rgba(200, 16, 46, 0.8), 0 0 30px rgba(200, 16, 46, 0.5)',
          },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
