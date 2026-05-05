/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      keyframes: {
        scroll: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },

        slowZoom: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },

      animation: {
        scroll: "scroll 20s linear infinite",
        slowZoom: "slowZoom 6s ease-in-out infinite",
        marquee: "marquee 25s linear infinite",
      },
    },
  },

  plugins: [require("tailwind-scrollbar-hide")],
};
