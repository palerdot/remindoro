const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// NOTE: Loader `include` paths are relative to this module
const paths = require('../paths')

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/

const getLoaders = (
  isEnvProduction = false,
  isEnvDevelopment = true,
  shouldUseRelativeAssetPaths = true,
  shouldUseSourceMap = false
) => {
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const styleLoaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: Object.assign(
          {},
          shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
        ),
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            // plugins: () => [
            //   require('postcss-flexbugs-fixes'),
            //   require('postcss-preset-env')({
            //     autoprefixer: {
            //       flexbox: 'no-2009',
            //     },
            //     stage: 3,
            //   }),
            // ],
            plugins: [
              'postcss-flexbugs-fixes',
              [
                'postcss-preset-env',
                {
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                },
              ],
            ],
          },

          // ident: 'postcss',
          implementation: 'postcss',

          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
    ].filter(Boolean)

    if (preProcessor) {
      styleLoaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      })
    }

    return styleLoaders
  }

  const FONT_PATTERN = /\.(woff|woff2|eot|ttf|otf)$/i

  const urlLoader = {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    // we are transpiling only stuffs within app src
    include: paths.appSrc,
    options: {
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]',
    },
  }

  // ref: https://webpack.js.org/guides/asset-modules/
  const fontLoader = {
    test: [FONT_PATTERN],
    // we are transpiling only stuffs within app src
    include: paths.appSrc,
    type: 'asset',
  }

  // TS transpilation
  // ref: https://github.com/Brooooooklyn/ts-import-plugin
  const tsImportPluginFactory = require('ts-import-plugin')

  const treeShakingLibOptions = [
    {
      libraryName: '@mui/material',
      libraryDirectory: '',
      camel2DashComponentName: false,
    },
    {
      libraryName: '@mui/icons-material',
      libraryDirectory: '',
      camel2DashComponentName: false,
    },
    // we are already using 'lodash-es' mapped as '@lodash'
    // this can be used in case of some emergency
    /* {
      style: false,
      libraryName: 'lodash',
      libraryDirectory: null,
      camel2DashComponentName: false
    } */
  ]

  const typescriptLoader = {
    // test: /\.tsx?$/,
    test: /\.(js|mjs|jsx|tsx|ts)$/,
    loader: require.resolve('ts-loader'),
    // we are transpiling only stuffs within app src
    include: paths.appSrc,
    exclude: /node_modules/,
    options: {
      // disable type checker - we will use it in fork plugin
      transpileOnly: true,
      getCustomTransformers: () => ({
        before: [tsImportPluginFactory(treeShakingLibOptions)],
      }),
    },
  }

  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader turns CSS into JS modules that inject <style> tags.
  // In production, we use MiniCSSExtractPlugin to extract that CSS
  // to a file, but in development "style" loader enables hot editing
  // of CSS.
  // By default we support CSS Modules with the extension .module.css
  const styleLoader = {
    test: cssRegex,
    // we are transpiling only stuffs within app src
    include: paths.appSrc,
    exclude: cssModuleRegex,
    use: getStyleLoaders({
      importLoaders: 1,
      sourceMap: isEnvProduction && shouldUseSourceMap,
    }),
    sideEffects: true,
  }
  // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
  // using the extension .module.css
  const cssModuleLoader = {
    test: cssModuleRegex,
    // we are transpiling only stuffs within app src
    include: paths.appSrc,
    use: getStyleLoaders({
      importLoaders: 1,
      sourceMap: isEnvProduction && shouldUseSourceMap,
      modules: true,
      getLocalIdent: getCSSModuleLocalIdent,
    }),
  }

  return {
    urlLoader,
    typescriptLoader,
    styleLoader,
    cssModuleLoader,
    fontLoader,
  }
}

module.exports = getLoaders
