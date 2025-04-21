module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          pixel: ['"Press Start 2P"', 'monospace'],
        },
        colors: {
          arcadePurple: '#2b003b',
          neonGreen: '#39ff14',
          neonBlue: '#00f0ff',
        },
      },
    },
    plugins: [],
  }
  