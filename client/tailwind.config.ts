import { type Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './src/index.css'],
  theme: {
    extend: {
      colors: {
        'main-green-dark': '#035C5C',
        'main-green': '#3e9d54',
        'main-blue': '#38B6FF',
        'main-yellow': '#FFDE59',
      },
      spacing: {
        xs: '0.5rem', // 8px
        sm: '1rem', // 16px
        md: '2rem', // 32px
        lg: '3rem', // 48px
        xl: '4rem', // 64px
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.p-xs': { padding: '0.5rem' },
        '.p-sm': { padding: '1rem' },
        '.p-md': { padding: '2rem' },
        '.p-lg': { padding: '3rem' },
        '.p-xl': { padding: '4rem' },
        // ... (rest of your utility classes)
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    }),
    plugin(function ({ addBase, theme }) {
      let allColors = flattenColorPalette(theme('colors'));
      let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

      addBase({
        ':root': newVars,
      });
    }),
  ],
} satisfies Config;

function flattenColorPalette(colors: object): object {
  return Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values == 'object'
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
            [color + (number === 'DEFAULT' ? '' : `-${number}`)]: hex,
          }))
        : [{ [`${color}`]: values }]
    )
  );
}
