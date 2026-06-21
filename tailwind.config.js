/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        parchment: {
          50: "#fbf6e9",
          100: "#f4e8d0",
          200: "#e8d5a8",
          300: "#d9bf82",
          400: "#c9a55c",
        },
        ink: {
          900: "#120a06",
          800: "#1e120a",
          700: "#2a1810",
          600: "#3a2416",
          500: "#4d3220",
        },
        amber: {
          warm: "#d4a574",
          dark: "#b8860b",
        },
        seal: {
          DEFAULT: "#8b2c2c",
          dark: "#6a1f1f",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Han Serif SC"', '"Noto Serif SC"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'wood-grain': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"%3E%3Crect width=\"100\" height=\"100\" fill=\"%232a1810\"/%3E%3Cpath d=\"M0,20 Q25,15 50,20 T100,20\" stroke=\"%233a2416\" fill=\"none\" stroke-width=\"2\"/%3E%3Cpath d=\"M0,50 Q25,45 50,50 T100,50\" stroke=\"%233a2416\" fill=\"none\" stroke-width=\"2\"/%3E%3Cpath d=\"M0,80 Q25,75 50,80 T100,80\" stroke=\"%233a2416\" fill=\"none\" stroke-width=\"2\"/%3E%3C/svg%3E')",
        'parchment-texture': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 200 200\"%3E%3Crect width=\"200\" height=\"200\" fill=\"%23f4e8d0\"/%3E%3Cfilter id=\"noise\" x=\"0\" y=\"0\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3CfeColorMatrix type=\"saturate\" values=\"0\"/%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23noise)\" opacity=\"0.08\"/%3E%3C/svg%3E')",
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(18, 10, 6, 0.3), 0 2px 4px -1px rgba(18, 10, 6, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(18, 10, 6, 0.4), 0 4px 6px -2px rgba(18, 10, 6, 0.3)',
        'stamp': '0 2px 8px rgba(139, 44, 44, 0.5)',
      },
      keyframes: {
        'ink-spread': {
          '0%': { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        'stamp-down': {
          '0%': { transform: 'scale(1.5)', opacity: '0' },
          '50%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'parchment-unroll': {
          '0%': { transform: 'scale(0.8)', opacity: '0', filter: 'blur(4px)' },
          '100%': { transform: 'scale(1)', opacity: '1', filter: 'blur(0)' },
        },
      },
      animation: {
        'ink-spread': 'ink-spread 0.6s ease-out forwards',
        'stamp-down': 'stamp-down 0.3s ease-out forwards',
        'parchment-unroll': 'parchment-unroll 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
