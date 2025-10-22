// postcss.config.js (Next 15 / Turbopack friendly)
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- use this, not 'tailwindcss'
    autoprefixer: {},
  },
};