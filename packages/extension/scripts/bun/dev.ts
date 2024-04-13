process.env.NODE_ENV = 'development'

import fs from 'node:fs/promises'
import { last } from 'lodash'
import yargs from 'yargs'
import { execa } from 'execa'
import webExt from 'web-ext'
import { hideBin } from 'yargs/helpers'
import stripJsonComments from 'strip-json-comments'
import 'colors'

const argv = yargs(hideBin(process.argv)).parseSync()

console.log(
  '\n-----------------------------------------------------\n'.yellow.bold
)

const OUT_DIR = 'out'

start()

function start() {
  fs.rm(`./${OUT_DIR}`, { force: true }).then(() => {
    console.log(`porumai ... ${OUT_DIR} deleted `.yellow)
    build()
  })
}

function build() {
  Bun.build({
    entrypoints: ['./src/init.tsx', './src/background/index.js'],
    outdir: `./${OUT_DIR}`,
    // splitting: true,
    naming: '[dir]/[name].[ext]',
    define: {
      'process.env.BUN_RATE_URL': 'https://jublime.com',
    },
  })
    .then(result => {
      const browser = argv.browser
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
      console.log('porumai ... bun buld finished ?'.blue)

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
    })
    .catch(error => {
      console.error('porumai ... bun build error'.red)
    })
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
  <script type="module" src="./init.js"></script>
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
