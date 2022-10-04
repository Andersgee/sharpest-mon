/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        strokedraw: {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        strokedraw: "strokedraw 2.5s cubic-bezier(0.33, 0.4, 0.96, 0.6) forwards",
      },
    },
  },
  plugins: [],
};
