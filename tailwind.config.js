/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
    colors: {
      primaryBg: "#1A1A1A",
      secondaryBg: "#1D1D1D",
      foreground: "#F0F0F0",
      foregroundAccent: "#A0A0A0",
      errorAccent: "#B92828",

      primaryControl: "#272727",
      primaryBorder: "#303030",

      primaryControlAccent: "#208CF0",
      primaryBorderAccent: "#2896F5",
      primaryControlActive: "#1482DC",
      primaryBorderActive: "#28A0F0",

      secondaryControlAccent: "#3F3F3F",
      secondaryBorderAccent: "#414141",
      secondaryControlActive: "#323232",
      secondaryBorderActive: "#373737",
    },
  },
  plugins: [],
};
