/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ===== UNIFIED COLOR PALETTE (as per spec) ===== */
      colors: {
        // Main brand colors (UNIFIED)
        'primary-blue': '#1a4d7d',
        'primary-cyan': '#00a8cc',
        'accent-ice': '#e8f4f8',
        'dark-navy': '#0a2540',

        // Supporting colors
        'off-white': '#f8fafb',
        'light-gray': '#e5eaed',
        'text-primary': '#1a2332',
        'text-secondary': '#5a6c7d',

        // Legacy colors for existing components (will be migrated)
        kelechek: {
          primary: '#1a4d7d',
          dark: '#0a2540',
          cyan: '#00a8cc',
          ice: '#e8f4f8',
        },
      },

      /* ===== TYPOGRAPHY ===== */
      fontFamily: {
        primary: ['Bebas Neue', 'sans-serif'],
        secondary: ['Montserrat', 'sans-serif'],
        accent: ['Playfair Display', 'serif'],
      },

      fontSize: {
        'hero': ['clamp(48px, 8vw, 96px)', { lineHeight: '1.1', letterSpacing: '0.02em' }],
        'h1': ['clamp(36px, 5vw, 64px)', { lineHeight: '1.2' }],
        'h2': ['clamp(28px, 4vw, 48px)', { lineHeight: '1.3' }],
        'h3': ['clamp(24px, 3vw, 36px)', { lineHeight: '1.3' }],
        'body-large': ['clamp(18px, 2vw, 24px)', { lineHeight: '1.5' }],
        'body': ['clamp(16px, 1.5vw, 18px)', { lineHeight: '1.6' }],
        'small': ['clamp(14px, 1.2vw, 16px)', { lineHeight: '1.5' }],
      },

      /* ===== SPACING (matches CSS vars) ===== */
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
        '2xl': '64px',
        '3xl': '96px',
        '4xl': '128px',
      },

      /* ===== BORDER RADIUS ===== */
      borderRadius: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'full': '9999px',
      },

      /* ===== SHADOWS (UNIFIED) ===== */
      boxShadow: {
        'sm': '0 1px 2px rgba(10, 37, 64, 0.05)',
        'md': '0 4px 6px rgba(10, 37, 64, 0.07)',
        'lg': '0 10px 15px rgba(10, 37, 64, 0.1)',
        'xl': '0 20px 25px rgba(10, 37, 64, 0.15)',
        '2xl': '0 25px 50px rgba(10, 37, 64, 0.25)',
        'glow-blue': '0 0 20px rgba(26, 77, 125, 0.4), 0 0 40px rgba(0, 168, 204, 0.3)',
        'glow-cyan': '0 0 30px rgba(0, 168, 204, 0.6), 0 0 60px rgba(0, 168, 204, 0.4)',
      },

      /* ===== BACKGROUND GRADIENTS (UNIFIED) ===== */
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1a4d7d 0%, #00a8cc 100%)',
        'gradient-overlay': 'linear-gradient(180deg, rgba(10, 37, 64, 0.7) 0%, rgba(0, 168, 204, 0.3) 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0a2540 0%, #1a4d7d 50%, #00a8cc 100%)',
        'gradient-light': 'linear-gradient(180deg, #ffffff 0%, #f8fafb 100%)',
        'gradient-ice': 'linear-gradient(135deg, #e8f4f8 0%, #ffffff 100%)',
      },

      /* ===== ANIMATIONS ===== */
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 168, 204, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 168, 204, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      /* ===== BREAKPOINTS ===== */
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      /* ===== CONTAINER ===== */
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    },
  },
  plugins: [],
}
