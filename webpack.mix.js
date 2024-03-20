const mix = require('laravel-mix');

mix.options({
  postCss: [require('tailwindcss')],
});

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

mix.copy('src/popup/index.html', 'dist/chrome/popup/popup.html');

mix
  .postCss('src/popup/resources/css/styles.css', 'build/popup/css/styles.css')
  .copy('build/popup/css/styles.css', 'dist/chrome/popup/css/styles.css');

mix
  .js('src/popup/index.jsx', 'build/popup/index.js')
  .react()
  .copy('build/popup/index.js', 'dist/chrome/popup/js/index.js');

mix
  .js('src/content/index.js', 'build/content/index.js')
  .copy('build/content/index.js', 'dist/chrome/content/index.js');
