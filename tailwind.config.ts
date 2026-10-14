import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#E9E8E2',
        sheet: '#F4F3EF',
        band: '#ECEBE5',
        rule: '#CFCDC4',
        'rule-strong': '#A9A79E',
        graphite: '#4F575B',
        slate: '#3A4246',
        body: '#2C3437',
        muted: '#6B7275',
        ink: '#1E2427',
        rust: {
          DEFAULT: '#B4532A',
          dark: '#953F1C',
          light: '#E39A73',
        },
        fog: '#C9C7BE',
        deep: '#24394C',
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'Menlo', 'monospace'],
      },
      keyframes: {
        drift: { from: { transform: 'translate(0, 0)' }, to: { transform: 'translate(-28px, 14px)' } },
        swath: { from: { left: '-12%' }, to: { left: '104%' } },
        rise: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        grow: { from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } },
        growx: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        'drawer-in': { from: { transform: 'translateX(48px)', opacity: '0' }, to: { transform: 'none', opacity: '1' } },
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
        'pin-pulse': { '0%': { transform: 'scale(.6)', opacity: '.9' }, '100%': { transform: 'scale(2.4)', opacity: '0' } },
      },
      animation: {
        drift: 'drift 40s ease-in-out infinite alternate',
        swath: 'swath 16s linear infinite',
        rise: 'rise .7s cubic-bezier(.2,.7,.2,1) both',
        'rise-fast': 'rise .45s cubic-bezier(.2,.7,.2,1) both',
        grow: 'grow .9s cubic-bezier(.2,.7,.2,1) both',
        growx: 'growx .5s cubic-bezier(.2,.7,.2,1) both',
        'drawer-in': 'drawer-in .42s cubic-bezier(.2,.7,.2,1) both',
        fade: 'fade .3s ease both',
        pin: 'pin-pulse 2.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
