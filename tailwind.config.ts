import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      fontWeight: {
        "500": "500",
        "600": "600",
        "700": "700",
        "800": "800",
      },
      colors: {
        // Extend slate with our exact bg-base
        slate: {
          950: "#020617",
        },
      },
      animation: {
        // Slow blink for critical alerts
        "blink-slow": "blink-slow 2.4s ease-in-out infinite",
        // Gentle float for status icon
        float: "float 3.5s ease-in-out infinite",
        // Horizontal scroll for wave
        "wave-scroll": "wave-scroll 6s linear infinite",
        // Expanding ring
        "ping-ring": "ping-ring 1.4s cubic-bezier(0,0,0.2,1) infinite",
        // Shimmer for skeletons
        shimmer: "shimmer 1.8s ease-in-out infinite",
      },
      keyframes: {
        "blink-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "wave-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "ping-ring": {
          "75%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow-cyan":
          "0 0 24px rgba(6,182,212,0.25), 0 0 64px rgba(6,182,212,0.06)",
        "glow-rose":
          "0 0 24px rgba(244,63,94,0.25), 0 0 64px rgba(244,63,94,0.06)",
        "glow-orange":
          "0 0 24px rgba(249,115,22,0.25), 0 0 64px rgba(249,115,22,0.06)",
        "glow-emerald":
          "0 0 24px rgba(16,185,129,0.25), 0 0 64px rgba(16,185,129,0.06)",
        "glow-amber":
          "0 0 24px rgba(245,158,11,0.25), 0 0 64px rgba(245,158,11,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
