import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#05529A",
          green: "#00A450",
          navy: "#104B7D",
          lime: "#92D051"
        },
        feedback: {
          negative: "#E84D4D",
          neutral: "#64748B"
        }
      },
      boxShadow: {
        panel: "0 24px 80px rgba(2, 8, 23, 0.18)",
        soft: "0 12px 36px rgba(15, 23, 42, 0.08)"
      },
      backgroundImage: {
        "mesh-grid":
          "radial-gradient(circle at top left, rgba(5, 82, 154, 0.18), transparent 36%), radial-gradient(circle at bottom right, rgba(0, 164, 80, 0.14), transparent 32%)"
      }
    }
  },
  plugins: []
};

export default config;
