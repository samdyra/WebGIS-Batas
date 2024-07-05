import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'main-green-dark': '#548888ff',
        'main-green': '#39AC4Dff',
        'main-blue': '#38B6FFff',
        'main-yellow': '#FFDE59ff',
      },
    },
  },
  plugins: [],
} satisfies Config;
