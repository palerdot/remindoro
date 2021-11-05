const argv = require('yargs').argv
const stripJsonComments = require('strip-json-comments')

function transformManifestVersion(content) {
  const manifest = JSON.parse(stripJsonComments(content.toString()))
  manifest.version = process.env.npm_package_version
  return Buffer.from(JSON.stringify(manifest))
}

/* Copied as it is to the `to` destination via CopyWebpackPlugin */
const copyPatterns = [
  {
    from: `src/manifests/${argv.browser}/manifest.json`,
    to: '.',
    transform: transformManifestVersion,
  },
  { from: 'src/img', to: 'img' },
  // {
  //   from: 'src/lib',
  //   to: 'lib/',
  // },
  // {
  //   from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
  //   to: 'lib/js/',
  // },
  // {
  //   from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
  //   to: 'lib/js/',
  // },
  // {
  //   from: 'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
  //   to: 'lib/js/',
  // },
  // START: Fonts
  // material fonts
  // {
  //   from: 'src/app/css/fonts/material-fonts.woff2',
  //   to: 'fonts/',
  // },
  // // Roboto fonts
  // {
  //   from: 'src/app/css/fonts/Roboto/',
  //   to: 'fonts/Roboto/',
  // },
  // {
  //   from: '**/*',
  //   // [ext] => .ext (no need to add .)
  //   // to: 'fonts/[path][name][ext]',
  //   to: 'fonts/',
  //   context: 'src/app/css/fonts',
  // },
  // START: Fonts
  /* {
    from:
      'node_modules/material-design-icons/iconfont/*.{eot,ttf,woff,woff2,css}',
    to: 'fonts/material-icons/[name].[ext]',
    toType: 'template',
  }, */
]

/* These are included into the HTML pages generated by HTMLWebpackPlugin*/
const htmlAssets = [
  // ref: https://github.com/mozilla/webextension-polyfill
  // mozilla's compatibility layer
  // 'lib/js/browser-polyfill.js',
  // 'lib/js/webcomponents-bundle.js',
  // 'lib/js/custom-elements-es5-adapter.js',
]

module.exports = {
  copyPatterns,
  htmlAssets,
}
