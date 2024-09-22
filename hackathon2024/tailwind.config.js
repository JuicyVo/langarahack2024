/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#ff8c59", // Lighter version of the orange
          DEFAULT: "#f15a22", // Your orange color
          dark: "#c2491c", // Darker version of the orange
        },
        secondary: {
          light: "#f5f5f5", // Very light gray
          DEFAULT: "#e0e0e0", // Lighter gray
          dark: "#b0b0b0", // Medium gray
        },
      },
    },
  },
  plugins: [],
};
