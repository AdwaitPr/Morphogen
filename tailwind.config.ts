import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--bg-base)',
          panel: 'var(--bg-panel)',
          elevated: 'var(--bg-elevated)',
        },
        border: {
          subtle: 'var(--border-subtle)',
        },
        accent: {
          teal: 'var(--accent-teal)',
          amber: 'var(--accent-amber)',
          alert: 'var(--accent-alert)',
          lime: 'var(--accent-lime)',
        },
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
      },
      fontFamily: {
        ui: ['var(--font-ui)'],
        mono: ['var(--font-mono)'],
      },
      boxShadow: {
        'glow-teal': 'var(--glow-teal)',
        'glow-amber': 'var(--glow-amber)',
        'panel': '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border-subtle)',
      },
      screens: {
        'desktop-min': '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
