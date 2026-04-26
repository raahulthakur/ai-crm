/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      // Zinc → Superleap teal palette based on user-specified bg #092428
      colors: {
        zinc: {
          950: '#131414',
          900: '#0E2D34',
          800: '#153C43',
          700: '#1E4D56',
          600: '#376978',
          500: '#558A98',
          400: '#7AADB8',
          300: '#9FC9D2',
          200: '#C0DDE3',
          100: '#DBEEF2',
          50:  '#EDF7F9',
        },
        // Amber → Superleap lime accent
        amber: {
          950: '#131B02',
          900: '#263405',
          800: '#3D520A',
          700: '#577310',
          600: '#769A18',
          500: '#97BE20',
          400: '#B8D82C',
          300: '#CAE855',
          200: '#DAF47D',
          100: '#ECFAAA',
          50:  '#F5FDD4',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'bounce-in': { '0%': { transform: 'scale(0.88)', opacity: '0' }, '65%': { transform: 'scale(1.03)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-up': 'slide-up 0.35s ease-out',
        'bounce-in': 'bounce-in 0.45s cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
  plugins: [],
}
