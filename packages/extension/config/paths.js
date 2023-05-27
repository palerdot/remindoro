const path = require('path')
const fs = require('fs')
const url = require('url')
const argv = require('yargs').argv

require('colors')

const appDirectory = fs.realpathSync(process.cwd())
console.log(`appDirectory: ${appDirectory}`.yellow)
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
console.log(resolveApp('.env').yellow)

const envPublicUrl = process.env.PUBLIC_URL

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/')
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1)
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`
  } else {
    return inputPath
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage

// TODO: remove this module; this is not
// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson)
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/')
  return ensureSlash(servedUrl, true)
}

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
]

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  )

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

const RELEASE_FOLDER = 'release'

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'), // TODO: not used; maybe remove?

  // final release folder
  appRelease: resolveApp(RELEASE_FOLDER),
  appExtension: resolveApp(`${RELEASE_FOLDER}/${argv.browser}`),

  appDev: resolveApp('dev-server'),

  // appPublic: resolveApp('public'),
  // appHtml: resolveApp('public/index.html'),

  appTemplate: resolveApp('config/template.html'),
  optionsTemplate: resolveApp('src/options/template.html'),
  sidebarTemplate: resolveApp('src/sidebar/template.html'),

  // IMPORTANT: 'app' is 'popup'
  // NOTE: all our logic is inside 'src/app'
  // we are making our 'app' as 'popup'. (popup is our app)
  popupTemplate: resolveApp('src/app/template.html'),
  // appPopupJs: resolveModule(resolveApp, 'src/popup/index'),
  appPopupJs: resolveModule(resolveApp, 'src/app/Init'),

  // we will be ignoring options/sidebar for timebeing
  /* 
  appOptionsJs: resolveModule(resolveApp, 'src/options/index'),
  appSidebarJs: resolveModule(resolveApp, 'src/sidebar/index'), 
  */

  appBackgroundJs: resolveModule(resolveApp, 'src/background/index'),
  appContentJs: resolveModule(resolveApp, 'src/content_scripts/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
}

module.exports.moduleFileExtensions = moduleFileExtensions
