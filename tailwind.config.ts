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
        // --- ჩვენი Mocha & Cream პალიტრა ---
        mocha: {
          light: '#FDFBF7',   // Cream (ძირითადი ფონი)
          medium: '#D6CCC2',  // Latte (ბორდერები/ღია ტექსტი)
          DEFAULT: '#A68A64', // Leather (ღილაკები/აქცენტები)
          dark: '#4A403A',    // Coffee (მთავარი ტექსტი/ჰედერი)
        },
        // თეთრი ფერი "შუშის" ეფექტებისთვის
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
          border: 'rgba(255, 255, 255, 0.5)',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // ან რაც გაქვს ფონტი
      },
    },
  },
  plugins: [],
};
export default config;