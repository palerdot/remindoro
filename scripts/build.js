'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
require('../config/env')

const path = require('path')
const chalk = require('chalk')
const argv = require('yargs').argv
const fs = require('fs-extra')
const webpack = require('webpack')
const bfj = require('bfj')
const configFactory = require('../config/webpack/webpack.config')
const paths = require('../config/paths')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const printHostingInstructions = require('react-dev-utils/printHostingInstructions')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')
const printBuildError = require('react-dev-utils/printBuildError')

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild
const useYarn = fs.existsSync(paths.yarnLockFile)

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

const isInteractive = process.stdout.isTTY

require('colors')
const { zip } = require('zip-a-folder')

const npm_version = process.env.npm_package_version
const browser = argv.browser
const release_zip_name = `remindoro-${browser}-v${npm_version}.zip`

if (!['firefox', 'chrome'].includes(browser)) {
  console.log('firefox/chrome browser not specified for prod build'.red.bold)
  process.exit(1)
}

// Process CLI arguments
// const argv = process.argv.slice(2)
// const writeStatsJson = argv.indexOf('--stats') !== -1

// Generate configuration
const config = configFactory('production')

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper')
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // First, read the current file sizes in Extension directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(paths.appExtension)
  })
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    // we are deleting the root release path - 'release/'
    fs.emptyDirSync(paths.appRelease)
    // fs.emptyDirSync(paths.appExtension)
    // Merge with the public folder
    // copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes)
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'))
        console.log(warnings.join('\n\n'))
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        )
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        )
      } else {
        console.log(chalk.green('Compiled successfully.\n'))
      }

      console.log('File sizes after gzip:\n')
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        // paths.appExtension,
        paths.appRelease,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      )

      const buildFolder = path.relative(process.cwd(), paths.appExtension)

      console.log(
        chalk.blue(`porumai ... ${browser} build complete - ${npm_version}`)
      )

      /* const appPackage = require(paths.appPackageJson)
      const publicUrl = paths.publicUrl
      const publicPath = config.output.publicPath
      const buildFolder = path.relative(process.cwd(), paths.appExtension)
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      ) */
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'))
      printBuildError(err)
      process.exit(1)
    }
  )
  .then(() => {
    console.log(
      chalk.yellow(`Creating Remindoro zip archive => ${npm_version}`)
    )
    return zip(paths.appExtension, `${paths.appRelease}/${release_zip_name}`)
  })
  .then(() => {
    const zipFolder = path.relative(process.cwd(), paths.appRelease)
    console.log(
      chalk.blue(`porumai ... wait and hope !!!`),
      chalk.cyan(`${zipFolder}/${release_zip_name}`)
    )
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  })

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Creating an optimized production build...')

  let compiler = webpack(config)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages
      if (err) {
        if (!err.message) {
          return reject(err)
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        })
      } else {
        /* messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        ); */

        // ref: https://github.com/facebook/create-react-app/issues/9880#issuecomment-746131468
        const rawMessages = stats.toJson({
          all: false,
          warnings: true,
          errors: true,
        })
        messages = formatWebpackMessages({
          errors: rawMessages.errors.map(e => e.message),
          warnings: rawMessages.warnings.map(e => e.message),
        })
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1
        }
        return reject(new Error(messages.errors.join('\n\n')))
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        )
        return reject(new Error(messages.warnings.join('\n\n')))
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      }

      /* if (writeStatsJson) {
        return bfj
          .write(paths.appExtension + '/bundle-stats.json', stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch(error => reject(new Error(error)))
      } */

      return resolve(resolveArgs)
    })
  })
}
