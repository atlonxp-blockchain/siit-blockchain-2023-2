import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#4155CC",
          "primary-focus": "#3444a3",
          "primary-content": "#ffffff",

          secondary: "#ff705b",
          "secondary-focus": "#cc5a49",
          "secondary-content": "#ffffff",

          accent: "#37cdbe",
          "accent-focus": "#2ba69a",
          "accent-content": "#ffffff",

          neutral: "#08090d",
          "neutral-focus": "#06070a",
          "neutral-content": "#ffffff",

          "base-100": "#12141D",
          "base-200": "#10121a",
          "base-300": "#0e1017",
          "base-content": "#ffffff",

          info: "#66c7ff",
          success: "#69ff82",
          warning: "#e1d460",
          error: "#ff6b6b",
        },
      },
    ],
  },
};
export default config;
