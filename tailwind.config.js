/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
    colors: {
      primaryBg: "#232323",
      secondaryBg: "#272727",
      foreground: "#EBEBEB",
      foregroundAccent: "#A0A0A0",
      foregroundError: "#B92828",

      primaryControl: "#2D2D2D",
      primaryBorder: "#323232",

      primaryControlAccent: "#208CF0",
      primaryBorderAccent: "#2896F5",
      primaryControlActive: "#1482DC",
      primaryBorderActive: "#28A0F0",

      secondaryControlAccent: "#3F3F3F",
      secondaryBorderAccent: "#414141",
      secondaryControlActive: "#323232",
      secondaryBorderActive: "#373737"
    }
  },
  plugins: [],
}
