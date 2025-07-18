import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'background-main': 'var(--color-background-main)',
        'red-background': 'var(--color-red-background)',
        'text-main': 'var(--color-text-main)',
        'text-hover': 'var(--color-text-hover)',
        'gray-button': 'var(--color-gray-button)',
        'transparent-black': 'var(--color-transparent-black)',
        'accent-blue': 'var(--color-accent-blue)',
        'accent-purple': 'var(--color-accent-purple)',
        'accent-orange': 'var(--color-accent-orange)',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
