process.env.NODE_ENV = 'development'

import { watch } from 'fs'
import fs from 'node:fs/promises'
import { head, last, isString } from 'lodash'
import { execa } from 'execa'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import 'colors'

import { build } from './utils'

const OUT_DIR = 'out'

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
    build({
      browser,
      outDir: OUT_DIR,
    })
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

start()

function start() {
  if (!is_valid_browser) {
    process.exit(1)
    return
  }

  fs.rm(`./${OUT_DIR}`, { force: true })
    .then(() => {
      console.log(`porumai ... ${OUT_DIR} deleted `.yellow)
      return build({
        browser,
        outDir: OUT_DIR,
      })
    })
    .then(outputs => {
      run_local_extension()
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
  } else if (browser === 'chrome') {
    console.log('porumai ... opening chrome extension')
    execa('node', ['scripts/chrome-launch.js'])
      .then(result => {
        console.log(result.stdout)
        console.log('porumai ... build finished ? all fine?')
      })
      .catch(err => {
        console.error(err)
      })
  }
}
