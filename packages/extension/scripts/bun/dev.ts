process.env.NODE_ENV = 'development'

import chalk from 'chalk'
import { watch } from 'fs'
import fs from 'node:fs/promises'
import { head, last, isString } from 'lodash'
import yargs from 'yargs'
import { execa } from 'execa'
import { hideBin } from 'yargs/helpers'
import stripJsonComments from 'strip-json-comments'
import 'colors'

import { get_config } from './config'

const argv = yargs(hideBin(process.argv)).parseSync()
const browser = argv.browser
const is_valid_browser =
  isString(browser) && ['chrome', 'firefox'].includes(browser)
if (!is_valid_browser) {
  console.log('porumai ... not a valid browser ', browser)
  process.exit(1)
}

const watcher = watch('./src/', { recursive: true }, (event, filename) => {
  const allowed_folders = ['app', 'background']
  const root_folder = head(filename?.split('/'))
  const is_valid_folder =
    root_folder !== undefined && allowed_folders.includes(root_folder)
  if (is_valid_folder) {
    console.log(`Detected ${event} in ${filename}`)
    build()
  }
})

process.on('SIGINT', () => {
  // close watcher when Ctrl-C is pressed
  console.log('Closing watcher...')
  watcher.close()

  process.exit(0)
})

console.log(
  '\n-----------------------------------------------------\n'.yellow.bold
)

const OUT_DIR = 'out'

start()

function start() {
  fs.rm(`./${OUT_DIR}`, { force: true })
    .then(() => {
      console.log(`porumai ... ${OUT_DIR} deleted `.yellow)
      return build()
    })
    .then(outputs => {
      run_local_extension()
    })
}

function build() {
  const config = get_config(browser as string)

  return Bun.build({
    entrypoints: ['./src/app/remindoro.tsx', './src/background/index.js'],
    outdir: `./${OUT_DIR}`,
    splitting: true,
    // naming: '[dir]/[name].[ext]',
    naming: {
      // default values
      entry: '[dir]/[name].[ext]',
      chunk: '[name].[ext]',
      asset: '[name].[ext]',
    },
    define: {
      'process.env.BUN_RATE_URL': config.rate_url,
    },
  })
    .then(result => {
      console.log(browser)
      // const chunks: Array<string> = []
      const styles: Array<string> = []
      result.outputs.forEach(value => {
        // const is_chunk = value.loader === 'js' && value.kind === 'chunk'
        const is_css =
          value.loader === 'file' &&
          value.kind === 'asset' &&
          value.type.includes('text/css')
        const file_name = last(value.path.split('/'))
        if (file_name) {
          // if (is_chunk) {
          //   chunks.push(file_name)
          // } else
          if (is_css) {
            styles.push(file_name)
          }
        }
      })
      copy_image_files()
      write_html_file(styles)
      write_manifest_file(browser)
      console.log(chalk.cyan('porumai ... bun build finished ?'))
      return new Promise(resolve => resolve(result.outputs))
    })
    .catch(error => {
      console.error('porumai ... bun build error'.red)
    })
}

function run_local_extension() {
  if (browser === 'firefox') {
    console.log('porumai ... opening firefox extension')

    execa('web-ext', [
      'run',
      '--firefox',
      '/Applications/Firefox.app/Contents/MacOS/firefox',
      '--source-dir',
      'out',
      '--pref',
      'startup.homepage_welcome_url=https://www.youtube.com',
    ])
      .then(result => {
        console.log(result.stdout)
        console.log('porumai ... build finished ? all fine?')
      })
      .catch(err => {
        console.error(err)
      })
  }
}

function write_html_file(styles: Array<string>) {
  console.log('porumai ... writing popup.html'.blue)
  // const chunks_markup = chunks.map(
  //   chunk => `<script src="./${chunk}" type="module"></script>`
  // )
  const styles_markup = styles.map(
    style => `<link rel="stylesheet" href="./${style}">`
  )

  const template = `<!DOCTYPE html>
<head>
  <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
  <meta charset="UTF-8" />
  ${styles_markup}
</head>

<body>
  <!-- Porumai: This is our Popup/App shell -->
  <div id="remindoro-app"></div>
  <script type="module" src="./app/remindoro.js"></script>
</body>`

  Bun.write(`./${OUT_DIR}/popup.html`, template)
}

function write_manifest_file(browser) {
  console.log(`porumai ... writing manifest for ${browser}`.blue)
  fs.readFile(`./src/manifests/${browser}/manifest.json`, 'utf8')
    .then(data => {
      const manifest = JSON.parse(stripJsonComments(data))
      manifest.version = process.env.npm_package_version
      Bun.write(`./${OUT_DIR}/manifest.json`, JSON.stringify(manifest))
    })
    .catch(err => {
      console.error(err)
    })
}

function copy_image_files() {
  fs.cp('./src/img', `./${OUT_DIR}/img`, { recursive: true }).then(() => {
    console.log('porumai ... img file copied')
  })
}
