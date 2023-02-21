/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      "sans-regular": ["FavoritNormal", "ui-sans-serif", "system-ui"],
      "sans-book": ["FavoritBook", "ui-sans-serif", "system-ui"],
      sans: ["FavoritLight", "ui-sans-serif", "system-ui"],
      mono: ["IBMPlexMono", "ui-monospace", "system-ui"],
    },
    colors: {
      transparent: "transparent",
      succinct: {
        blue: "#0E283D",
        black: "#050E16",
        white: "#FFFFFF",
        "teal-dark": "#18232A",
        teal: "#C3DFE0",
        neon: "#E8FE56",
      },
    },
    extend: {},
  },
  plugins: [
    // https://gist.github.com/Merott/d2a19b32db07565e94f10d13d11a8574
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = "") {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === "string"
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ":root": extractColorVars(theme("colors")),
      });
    },
  ],
};
