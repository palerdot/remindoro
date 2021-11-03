const { IgnorePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('css-minimizer-webpack-plugin')
const HtmlIncAssetsPlugin = require('html-webpack-tags-plugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const CopyPlugin = require('copy-webpack-plugin')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const paths = require('../paths')
const staticFiles = require('./static-files')

const minifyHtml = {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
}

const getPlugins = (isEnvProduction = false, shouldUseSourceMap = false) => {
  /* HTML Plugins for options, sidebar, options */
  // we are ignoring options for time being
  /* const optionsHtmlPlugin = new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        title: 'Options',
        chunks: ['options'],
        filename: 'options.html',
        template: paths.optionsTemplate,
      },
      isEnvProduction
        ? {
            minify: minifyHtml,
          }
        : undefined
    )
  ) */

  const popupHtmlPlugin = new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        title: 'Popup',
        chunks: ['popup'],
        filename: 'popup.html',
        template: paths.popupTemplate,
      },
      isEnvProduction
        ? {
            minify: minifyHtml,
          }
        : undefined
    )
  )

  /*
   * We are ignoring sidebar for timebeing
   */

  /* const sidebarHtmlPlugin = new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        title: 'Sidebar',
        chunks: ['sidebar'],
        filename: 'sidebar.html',
        template: paths.sidebarTemplate,
      },
      isEnvProduction
        ? {
            minify: minifyHtml,
          }
        : undefined
    )
  ) */

  const moduleNotFoundPlugin = new ModuleNotFoundPlugin(paths.appPath)
  const caseSensitivePathsPlugin = new CaseSensitivePathsPlugin()
  const watchMissingNodeModulesPlugin = new WatchMissingNodeModulesPlugin(
    paths.appNodeModules
  )
  const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: '[name].css',
    // chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
  })
  // const ignorePlugin = new IgnorePlugin(/^\.\/locale$/, /moment$/)
  // const ignorePlugin = new IgnorePlugin({requestRegExp: /moment\/locale\//})
  const ignorePlugin = new IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/,
  })
  const terserPlugin = new TerserPlugin({
    terserOptions: {
      parse: {
        ecma: 8,
      },
      compress: {
        ecma: 5,
        warnings: false,
        comparisons: false,
        inline: 2,
      },
      mangle: {
        safari10: true,
      },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true,
      },
    },
    parallel: true,
    // cache: true,
    // sourceMap: shouldUseSourceMap,
  })

  // ref: https://github.com/webpack-contrib/css-minimizer-webpack-plugin
  const optimizeCSSAssetsPlugin = new OptimizeCSSAssetsPlugin({
    minimizerOptions: {
      processorOptions: {},
    },
  })

  /* Include these static JS and CSS assets in the generated HTML files */
  const htmlIncAssetsPlugin = new HtmlIncAssetsPlugin({
    append: false,
    // assets: staticFiles.htmlAssets,
    files: staticFiles.htmlAssets,
  })

  const moduleScopePlugin = new ModuleScopePlugin(paths.appSrc, [
    paths.appPackageJson,
  ])
  const copyPlugin = new CopyPlugin({
    patterns: staticFiles.copyPatterns,
  })
  const friendlyErrorsWebpackPlugin = new FriendlyErrorsWebpackPlugin()

  const tsconfigPathsPlugin = new TsconfigPathsPlugin({})

  // eslint to enforce ts/react specific stuffs (prettier is just for formatting)
  const eslintPlugin = new ESLintPlugin({
    extensions: ['.ts', '.tsx'],
  })

  // ts checker plugin
  const tsCompileTimeCheckPlugin = new ForkTsCheckerWebpackPlugin()

  return {
    eslintPlugin,
    // optionsHtmlPlugin,
    popupHtmlPlugin, // main app
    // sidebarHtmlPlugin,
    moduleNotFoundPlugin,
    caseSensitivePathsPlugin,
    watchMissingNodeModulesPlugin,
    miniCssExtractPlugin,
    ignorePlugin,
    terserPlugin,
    optimizeCSSAssetsPlugin,
    moduleScopePlugin,
    copyPlugin,
    htmlIncAssetsPlugin,
    friendlyErrorsWebpackPlugin,
    tsconfigPathsPlugin,
    tsCompileTimeCheckPlugin,
  }
}

module.exports = getPlugins
