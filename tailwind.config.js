/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}",
    "./*.tsx"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors - Professional Blue/Purple Gradient
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d5ff',
          300: '#a5b7ff',
          400: '#7f91ff',
          500: '#5e6bff',
          600: '#4c4ff7',
          700: '#3f3ce3',
          800: '#3432bc',
          900: '#2d2d98',
          950: '#1a1a5e'
        },
        // Secondary - Emerald Green for Success/Money
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        },
        // Accent - Electric Cyan
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344'
        },
        // Danger/Error - Professional Red
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        // Warning - Amber
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        // Dark Mode Backgrounds
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        // Glass Effects
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.12)',
          heavy: 'rgba(255, 255, 255, 0.16)',
          border: 'rgba(255, 255, 255, 0.18)',
          dark: 'rgba(0, 0, 0, 0.4)'
        },
        // Position-specific colors for fantasy
        position: {
          qb: '#ef4444',   // Red
          rb: '#10b981',   // Emerald
          wr: '#3b82f6',   // Blue
          te: '#f59e0b',   // Amber
          k: '#8b5cf6',    // Purple
          def: '#ec4899',  // Pink
          flex: '#06b6d4'  // Cyan
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem'
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'bounce-slow': 'bounce 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(94, 107, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(94, 107, 255, 0.8), 0 0 40px rgba(94, 107, 255, 0.4)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(94, 107, 255, 0.3)',
        'glow-md': '0 0 20px rgba(94, 107, 255, 0.4)',
        'glow-lg': '0 0 30px rgba(94, 107, 255, 0.5)',
        'glow-xl': '0 0 40px rgba(94, 107, 255, 0.6)',
        'inner-glow': 'inset 0 0 20px rgba(94, 107, 255, 0.2)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
        'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.45)',
        'dark': '0 10px 40px rgba(0, 0, 0, 0.7)',
        'dark-xl': '0 20px 60px rgba(0, 0, 0, 0.8)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #065f46 100%)',
        'gradient-danger': 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        'mesh-gradient': `radial-gradient(at 40% 20%, hsla(240, 100%, 74%, 0.3) 0px, transparent 50%),
                         radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.3) 0px, transparent 50%),
                         radial-gradient(at 0% 50%, hsla(355, 100%, 74%, 0.3) 0px, transparent 50%),
                         radial-gradient(at 80% 100%, hsla(240, 100%, 74%, 0.3) 0px, transparent 50%),
                         radial-gradient(at 0% 100%, hsla(189, 100%, 56%, 0.3) 0px, transparent 50%)`
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
        '4xl': '2560px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities, addComponents, theme, addBase }) {
      // Add base group functionality
      addBase({
        '.group': {
          /* Base group class */
        }
      })
      
      // Add custom utility classes
      addUtilities({
        '.glass': {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        '.text-gradient': {
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        /* Group hover utilities */
        '.group:hover .group-hover\\:opacity-100': { opacity: '1' },
        '.group:hover .group-hover\\:opacity-20': { opacity: '0.2' },
        '.group:hover .group-hover\\:opacity-30': { opacity: '0.3' },
        '.group:hover .group-hover\\:opacity-50': { opacity: '0.5' },
        '.group:hover .group-hover\\:scale-110': { transform: 'scale(1.1)' },
        '.group:hover .group-hover\\:flex': { display: 'flex' },
        '.group:hover .group-hover\\:text-white': { color: 'white' },
        '.group:hover .group-hover\\:text-blue-400': { color: 'rgb(96 165 250)' },
        '.group:hover .group-hover\\:text-blue-300': { color: 'rgb(147 197 253)' },
        '.group:hover .group-hover\\:text-primary-400': { color: 'rgb(127 145 255)' },
        '.group:hover .group-hover\\:text-red-500': { color: 'rgb(239 68 68)' },
        '.group:hover .group-hover\\:text-transparent': { color: 'transparent' },
        '.group:hover .group-hover\\:bg-gradient-to-r': { 
          backgroundImage: 'linear-gradient(to right, var(--tw-gradient-stops))' 
        },
        '.group:hover .group-hover\\:bg-clip-text': { 
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text'
        },
        '.group:hover .group-hover\\:-translate-x-1': { transform: 'translateX(-0.25rem)' },
        '.group:hover .group-hover\\:text-gray-300': { color: 'rgb(209 213 219)' },
        '.group:hover .group-hover\\:text-gray-500': { color: 'rgb(107 114 128)' }
      })

      // Add custom component classes
      addComponents({
        '.btn-primary': {
          '@apply bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0': {}
        },
        '.btn-secondary': {
          '@apply bg-glass border border-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:bg-white/10 hover:border-white/30 hover:shadow-lg hover:-translate-y-0.5': {}
        },
        '.card-glass': {
          '@apply bg-glass rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-glass': {}
        }
      })
    }
  ]
}