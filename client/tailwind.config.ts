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
        '.m-xs': { margin: '0.5rem' },
        '.m-sm': { margin: '1rem' },
        '.m-md': { margin: '2rem' },
        '.m-lg': { margin: '3rem' },
        '.m-xl': { margin: '4rem' },
        '.pt-xs': { paddingTop: '0.5rem' },
        '.pt-sm': { paddingTop: '1rem' },
        '.pt-md': { paddingTop: '2rem' },
        '.pt-lg': { paddingTop: '3rem' },
        '.pt-xl': { paddingTop: '4rem' },
        '.pr-xs': { paddingRight: '0.5rem' },
        '.pr-sm': { paddingRight: '1rem' },
        '.pr-md': { paddingRight: '2rem' },
        '.pr-lg': { paddingRight: '3rem' },
        '.pr-xl': { paddingRight: '4rem' },
        '.pb-xs': { paddingBottom: '0.5rem' },
        '.pb-sm': { paddingBottom: '1rem' },
        '.pb-md': { paddingBottom: '2rem' },
        '.pb-lg': { paddingBottom: '3rem' },
        '.pb-xl': { paddingBottom: '4rem' },
        '.pl-xs': { paddingLeft: '0.5rem' },
        '.pl-sm': { paddingLeft: '1rem' },
        '.pl-md': { paddingLeft: '2rem' },
        '.pl-lg': { paddingLeft: '3rem' },
        '.pl-xl': { paddingLeft: '4rem' },
        '.mt-xs': { marginTop: '0.5rem' },
        '.mt-sm': { marginTop: '1rem' },
        '.mt-md': { marginTop: '2rem' },
        '.mt-lg': { marginTop: '3rem' },
        '.mt-xl': { marginTop: '4rem' },
        '.mr-xs': { marginRight: '0.5rem' },
        '.mr-sm': { marginRight: '1rem' },
        '.mr-md': { marginRight: '2rem' },
        '.mr-lg': { marginRight: '3rem' },
        '.mr-xl': { marginRight: '4rem' },
        '.mb-xs': { marginBottom: '0.5rem' },
        '.mb-sm': { marginBottom: '1rem' },
        '.mb-md': { marginBottom: '2rem' },
        '.mb-lg': { marginBottom: '3rem' },
        '.mb-xl': { marginBottom: '4rem' },
        '.ml-xs': { marginLeft: '0.5rem' },
        '.ml-sm': { marginLeft: '1rem' },
        '.ml-md': { marginLeft: '2rem' },
        '.ml-lg': { marginLeft: '3rem' },
        '.ml-xl': { marginLeft: '4rem' },
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
