/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        darkBg: "#0f172a",  // deep slate
        darkCard: "#1e293b", // card background
        accent: "#38bdf8",   // cyan accent
      },
      fontFamily: {
        luckiest: ["Luckiest Guy", "cursive"],
        mulish: ["Mulish", "sans-serif"],
      },

    },
  },
  plugins: [],
};
