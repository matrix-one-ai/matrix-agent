/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";

export const content = [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",

  // Or if using `src` directory:
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    fontSize: {
      h1: ["2.25rem", { lineHeight: "2.5rem" }], // 36px
      h2: ["1.875rem", { lineHeight: "2.25rem" }], // 30px
      h3: ["1.5rem", { lineHeight: "2rem" }], // 24px
      h4: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
      h5: ["1.125rem", { lineHeight: "1.5rem" }], // 18px
      h6: ["1rem", { lineHeight: "1.5rem" }], // 16px
    },
    fontFamily: {
      sans: ["var(--font-comic-neue)", ...fontFamily.sans],
    },
    colors: {
      primary: "#F7E3B5",
      secondary: "#70C238",
    },
  },
};
export const plugins = [];
