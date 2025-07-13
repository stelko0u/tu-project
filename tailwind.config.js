/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E1E1E",

        car: {
          100: "#e5e6f5",
          200: "#cccee9",
          300: "#b2b5dd",
          400: "#999cc6",
          500: "#6567ad",
          600: "#5a5c9a",
          700: "#4e5086",
          800: "#434573",
          900: "#37395f",
        },
      },
      boxShadow: {
        "custom-black":
          "0px 4px 6px -1px rgba(0, 0, 0, 0.75), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      fontFamily: {
        "dm-sans": ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};
