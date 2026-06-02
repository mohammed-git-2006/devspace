/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmicPurple: "#7d5fff",
        neonGreen: "#39ff14",
        starlightBlue: "#00cfff",
      },
    },
  },
  plugins: [],
};
