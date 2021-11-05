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
    options: {
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]',
    },
  }

  // ref: https://webpack.js.org/guides/asset-modules/
  const fontLoader = {
    test: [FONT_PATTERN],
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
    test: /\.tsx?$/,
    loader: require.resolve('ts-loader'),
    exclude: /node_modules/,
    options: {
      // disable type checker - we will use it in fork plugin
      transpileOnly: true,
      getCustomTransformers: () => ({
        before: [tsImportPluginFactory(treeShakingLibOptions)],
      }),
      compilerOptions: {
        module: 'es2015',
      },
    },
  }

  // Process application JS with Babel.
  // The preset includes JSX, Flow, TypeScript, and some ESnext features.
  // note: we are transpiling only JS (for TS see above)
  const insideBabelLoaderOnlyJS = {
    test: /\.(js|mjs|jsx)$/,
    include: paths.appSrc,
    loader: require.resolve('babel-loader'),
    options: {
      customize: require.resolve('babel-preset-react-app/webpack-overrides'),

      plugins: [
        [
          require.resolve('babel-plugin-named-asset-import'),
          {
            loaderMap: {
              svg: {
                ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
              },
            },
          },
        ],
      ],
      cacheCompression: isEnvProduction,
      compact: isEnvProduction,
    },
  }
  // Process any JS outside of the app with Babel.
  // Unlike the application JS, we only compile the standard ES features.
  const outsideBabelLoader = {
    test: /\.(js|mjs)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    resolve: {
      // ref: https://github.com/webpack/webpack/issues/11467
      fullySpecified: false,
    },
    loader: require.resolve('babel-loader'),
    options: {
      babelrc: false,
      configFile: false,
      compact: false,
      presets: [
        [
          require.resolve('babel-preset-react-app/dependencies'),
          { helpers: true },
        ],
      ],
      cacheDirectory: true,
      cacheCompression: isEnvProduction,
      sourceMaps: false,
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
    use: getStyleLoaders({
      importLoaders: 1,
      sourceMap: isEnvProduction && shouldUseSourceMap,
      modules: true,
      getLocalIdent: getCSSModuleLocalIdent,
    }),
  }

  const fileLoader = {
    loader: require.resolve('file-loader'),
    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/, FONT_PATTERN],
    options: {
      name: 'static/media/[name].[hash:8].[ext]',
    },
  }

  return {
    urlLoader,
    typescriptLoader,
    insideBabelLoader: insideBabelLoaderOnlyJS,
    outsideBabelLoader,
    styleLoader,
    cssModuleLoader,
    fontLoader,
    fileLoader,
  }
}

module.exports = getLoaders
