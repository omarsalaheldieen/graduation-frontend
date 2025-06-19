/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00809D",     // Blue-green
        cream: "#FCECDD",       // Light cream
        oranges: "#FF7601",      // Vibrant orange
        peach: "#F3A26D",       // Soft peach
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Optional modern font
           marker: ['"Permanent Marker"', 'cursive']
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pop': 'pop 0.4s ease-in-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'track-in-contract': 'trackInContract 1s ease-out both',
        'track-in-expand': 'trackInExpand 0.7s ease-in-out both',
        'float': "float 3s ease-in-out infinite",
        'scale-fade': 'scale-fade 300ms ease-out forwards',
        'bounce-cart': 'bounceCart 1s infinite ease-in-out', 
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'scale-fade': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        trackInContract: {
          '0%': {
            opacity: 0,
            transform: 'scale(1.2)',
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
        trackInExpand: {
          '0%': {
            letterSpacing: '-.5em',
            opacity: '0',
          },
          '40%': {
            opacity: '0.6',
          },
          '100%': {
            opacity: '1',
            letterSpacing: 'normal',
          },
        },
        bounceCart: { 
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(-5deg)' },
          '50%': { transform: 'translateY(0) rotate(5deg)' },
          '75%': { transform: 'translateY(-5px) rotate(0deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
