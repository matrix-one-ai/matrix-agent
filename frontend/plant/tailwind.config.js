/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
        verdana: ["Verdana", "sans-serif"],
      },
      backgroundColor: {
        main: "#d9d9d9",
      },
    },
  },
  plugins: [],
};
