/** @type {import('tailwindcss').Config} */ module.exports = {
  content: [
    './src/content/**/*.html',
    './src/content/**/*.js',
    './src/content/**/*.vue',
  ],
  prefix: 'be-',
  important: true,
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
