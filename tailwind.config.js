/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx", "./index.html"],
  darkMode: "class",
  theme: {
    extend: {
      dropShadow: {
        custom: "0 0px 10px rgba(0, 0, 0, 0.7)",
      },
    },
    colors: {
      dark: "#1a1a1a",
      light: "#1d1d1d",

      white: "#f0f0f0",
      grey: "#a0a0a0",
      red: "#b92828",
      green: "#56db56",

      primary: "#272727",
      primaryAccent: "#208cf0",
      primaryActive: "#1482dc",

      secondary: "#272727",
      secondaryAccent: "#292929",
      secondaryActive: "#303030",

      border: "#353535",
      borderAccent: "#3b3b3b",
      borderActive: "#4e4e4e",
    },
  },
  plugins: [],
};
