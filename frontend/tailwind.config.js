/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      "sans-regular": ["FavoritNormal", "ui-sans-serif", "system-ui"],
      "sans-book": ["FavoritBook", "ui-sans-serif", "system-ui"],
      "sans-light": ["FavoritLight", "ui-sans-serif", "system-ui"],
      sans: ["FavoritNormal", "ui-sans-serif", "system-ui"],
      mono: ["IBMPlexMono", "ui-monospace", "system-ui"],
    },
    colors: {
      transparent: "transparent",
      succinct: {
        blue: "#0E283D",
        black: "#050E16",
        white: "#FFFFFF",
        teal: "#C3DFE0",
        "teal-5": "#0F1820",
        "teal-10": "#18232A",
        "teal-20": "#2B383E",
        "teal-30": "#3E4D53",
        "teal-40": "#516267",
        "teal-50": "#64767B",
        "teal-60": "#778B8F",
        "teal-70": "#8AA0A3",
        "teal-80": "#9DB5B8",
        "teal-90": "#B0CACC",
        "teal-100": "#C3DFE0",
        neon: "#E8FE56",
        orange: "#FE6535",
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
