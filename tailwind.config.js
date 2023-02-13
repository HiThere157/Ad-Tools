/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
    colors: {
      darkBg: "#1A1A1A",
      lightBg: "#1D1D1D",
      whiteColor: "#F0F0F0",
      whiteColorAccent: "#A0A0A0",
      redColor: "#B92828",
      greenColor: "#56db56",
      orangeColor: "#e37b11",

      elBg: "#272727",
      elAccentBg: "#208CF0",
      elActiveBg: "#1482DC",
      elDarkerActiveBg: "#0d72cf",

      elFlatBg: "#1A1A1A",
      elFlatAccentBg: "#292929",
      elFlatActiveBg: "#303030",

      elFlatBorder: "#353535",
      elFlatAccentBorder: "#3b3b3b",
      elFlatActiveBorder: "#4e4e4e",
    },
  },
  plugins: [],
};
