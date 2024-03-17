mix.options({
  postCss: [require('tailwindcss')],
});

const mix = require('laravel-mix');

/**
 * Build and Copy Background Scripts
 */
mix
  .js('src/background.js', 'build/background.js')
  .copy('build/background.js', 'dist/chrome/background.js');

mix.copyDirectory('src/public/images', 'dist/chrome/images');

/**
 * Copy Manifests
 */
mix.copy('src/extensions/chrome/manifest.json', 'dist/chrome/manifest.json');

mix
  .postCss('src/popup/resources/css/styles.css', 'build/popup/css/styles.css')
  .copy('build/popup/css/styles.css', 'dist/chrome/popup/css/styles.css');
