import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E7F5C",
          dark: "#14523C",
          light: "#2F9F74"
        },
        accent: "#F39C12",
        background: "#F3F7F4"
      }
    }
  },
  plugins: []
};

export default config;

