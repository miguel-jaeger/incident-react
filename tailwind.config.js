/** @type {import('tailwindcss').Config} */
// Tema corporativo UTP: mismos nombres de token que usa App.jsx,
// con la paleta del diseño de referencia (rojo UTP, neutros slate, azul de acciones).
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F1F4F9',
        surface: '#FFFFFF',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F8FAFC',
        'surface-container': '#E3E8EF',
        'on-surface': '#0F172A',
        'on-surface-variant': '#64748B',
        outline: '#94A3B8',
        primary: '#C8102E',
        'primary-container': '#A30D25',
        'on-primary': '#FFFFFF',
        tertiary: '#2563EB',
        'tertiary-container': '#3B82F6',
        'tertiary-fixed': '#DBEAFE',
        'on-tertiary-fixed-variant': '#1E40AF',
        error: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        'headline-md': ['Inter', 'system-ui', 'sans-serif'],
        'headline-sm': ['Inter', 'system-ui', 'sans-serif'],
        'body-md': ['Inter', 'system-ui', 'sans-serif'],
        'body-sm': ['Inter', 'system-ui', 'sans-serif'],
        'label-sm': ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
