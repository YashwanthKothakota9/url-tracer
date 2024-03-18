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

/**
 * Copy Extension Page
 */
// index.html
mix.copy('src/pages/index.html', 'dist/chrome/pages/index.html');

// styles.css
mix
  .postCss('src/pages/resources/css/styles.css', 'build/pages/css/styles.css')
  .copy('build/pages/css/styles.css', 'dist/chrome/pages/css/styles.css');

// index.js
mix
  .js('src/pages/index.jsx', 'build/pages/index.js')
  .react()
  .copy('build/pages/index.js', 'dist/chrome/pages/js/index.js');

/**
 * Copy Content Scripts
 */

//styles.css
mix
  .postCss(
    'src/content/resources/css/styles.css',
    'build/content/css/styles.css'
  )
  .copy('build/content/css/styles.css', 'dist/chrome/content/css/styles.css');

//index.js
mix
  .js('src/content/index.jsx', 'build/content/index.js')
  .react()
  .copy('build/content/index.js', 'dist/chrome/content/index.js');
