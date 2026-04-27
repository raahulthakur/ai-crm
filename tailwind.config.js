/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Zinc → design system neutral gray scale (light mode)
        // 50=darkest text → 950=lightest page bg
        zinc: {
          50:  '#111827',  // primary text
          100: '#1F2937',  // text (design system Text color)
          200: '#374151',  // body text
          300: '#4B5563',  // secondary text
          400: '#6B7280',  // muted text
          500: '#9CA3AF',  // placeholder / very muted
          600: '#D1D5DB',  // disabled / subtle
          700: '#E5E7EB',  // borders (design system border)
          800: '#F3F4F6',  // subtle bg / system chat bg
          900: '#FFFFFF',  // card bg (white)
          950: '#FAFBFC',  // page bg (design system Background)
        },
        // Amber → design system primary green
        amber: {
          50:  '#ECFDF5',  // healthy badge bg / user chat bg
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#10B981',  // Success green
          400: '#059669',  // PRIMARY action color (all buttons)
          500: '#047857',  // pressed / darker primary
          600: '#065F46',
          700: '#064E3B',
          800: '#022C22',
          900: '#011A15',
          950: '#000E0A',
        },
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        primary:     { DEFAULT: 'hsl(var(--primary))',     foreground: 'hsl(var(--primary-foreground))' },
        secondary:   { DEFAULT: 'hsl(var(--secondary))',   foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted:       { DEFAULT: 'hsl(var(--muted))',       foreground: 'hsl(var(--muted-foreground))' },
        accent:      { DEFAULT: 'hsl(var(--accent))',      foreground: 'hsl(var(--accent-foreground))' },
        card:        { DEFAULT: 'hsl(var(--card))',        foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-in':   { from: { opacity: '0', transform: 'translateY(6px)' },  to: { opacity: '1', transform: 'translateY(0)' } },
        'slide-up':  { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'bounce-in': { '0%': { transform: 'scale(0.88)', opacity: '0' }, '65%': { transform: 'scale(1.03)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
      animation: {
        'fade-in':   'fade-in 0.25s ease-out',
        'slide-up':  'slide-up 0.35s ease-out',
        'bounce-in': 'bounce-in 0.45s cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
  plugins: [],
}
