/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#D8B4FE", // Light purple
          DEFAULT: "#8B5CF6", // Normal purple (primary)
          dark: "#6D28D9", // Dark purple
        },
        secondary: {
          light: "#E5E7EB", // Light gray
          DEFAULT: "#9CA3AF", // Normal gray (secondary)
          dark: "#4B5563", // Dark gray
        },
      },
    },
  },
  plugins: [],
};
