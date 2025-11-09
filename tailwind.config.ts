import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // CopyPrint brand colors
        brand: {
          orange: {
            primary: '#FF6A2B',    // Main orange from gradient
            secondary: '#FF7A59',  // Second orange from gradient  
            light: '#FF9FB1',      // Light pink from gradient
            dark: '#F16E02',       // Previous orange (fallback)
            darker: '#F16518',     // Previous hover orange
          },
          blue: {
            dark: '#0B1020',       // Darkest blue from gradient
            medium: '#1E2735',     // Medium blue from gradient
            light: '#37507B',      // Lightest blue from gradient
          },
          legacy: {
            // Legacy colors for backward compatibility
            orange: '#F16E02',
            hover: '#F16518',
            alt: '#DC6342',
            purple: '#9C80B1',
            dark: '#181819',
          }
        },
        // Standard orange palette
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF6A2B', // Brand primary
          600: '#FF7A59', // Brand secondary
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Menlo', 'Monaco', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Main site gradient (Lovable-style)
        'lovable': 'radial-gradient(1400px 900px at 50% 100%, #FF6A2B 0%, #FF7A59 20%, #FF9FB1 35%, rgba(255,159,177,0.3) 50%, rgba(255,255,255,0) 70%), linear-gradient(180deg, #0B1020 0%, #1E2735 30%, #37507B 50%, #1E2735 70%, #0B1020 100%)',
        // Legacy gradient (fallback)
        'legacy': 'radial-gradient(1200px 700px at 50% 115%, #F16E02 0%, #F16518 22%, #DC6342 40%, rgba(255,255,255,0) 62%), linear-gradient(180deg, #181819 0%, #1E2735 25%, #37507B 45%, #9C80B1 65%, #181819 100%)',
        // Noise texture for grain effect
        'noise': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'.03\'/></svg>")',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 106, 43, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 106, 43, 0.8), 0 0 30px rgba(255, 106, 43, 0.6)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(255, 106, 43, 0.3)',
        'glow-orange-strong': '0 0 30px rgba(255, 106, 43, 0.5)',
        'glow-pink': '0 0 20px rgba(255, 159, 177, 0.3)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.15)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
        'button': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [],
} satisfies Config
