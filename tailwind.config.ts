import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    "./src/**/*.{ts,tsx,mdx}"
  ],
  theme: {
    screens: {
      "sm": "640px",
      "md": "768px",
      "lg": "1025px",
    },
    extend: {
      boxShadow: {
        "balance-yellow-primary": "0px 0px 8px 1px rgba(253, 208, 38, 0.4)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1.4s infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        "cattedrale": ["Cattedrale", "sans-serif"],
        "cattedrale-outline": ["Cattedrale-Outline", "sans-serif"],
        "imbue": ["Imbue", "serif"],
      },
      colors: {
        "primary": "#0C1914",
        "secondary": "#0A1214",
        "primary-yellow": "#FDD026",
        "secondary-yellow": "#B89926",
      },
    },
  },
  plugins: [],
});
