// ფაილის გზა: tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mocha: {
          light: '#FDFBF7',
          medium: '#D6CCC2',
          DEFAULT: '#A68A64',
          dark: '#4A403A',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
          border: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.3)',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};
export default config;