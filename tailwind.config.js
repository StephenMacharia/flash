/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0D98BA",
          dark: "#0B7E9A",
          deep: "#086A82",
        },
      },
    },
  },
  plugins: [],
};
