import fs from 'node:fs/promises'
import chalk from 'chalk'
import { last } from 'lodash-es'
import stripJsonComments from 'strip-json-comments'
import { execa } from 'execa'
import 'colors'

import { get_browser_config, get_runtime_config } from './config'

type BuildArgs = {
  outDir: string
  browser: string
}

export function build({ outDir, browser }: BuildArgs) {
  const browser_config = get_browser_config(browser)
  const runtime_config = get_runtime_config()

  return Bun.build({
    entrypoints: ['./src/app/remindoro.tsx', './src/background/index.js'],
    outdir: `./${outDir}`,
    splitting: true,
    // naming: '[dir]/[name].[ext]',
    naming: {
      // default values
      entry: '[dir]/[name].[ext]',
      chunk: '[name].[ext]',
      asset: '[name].[ext]',
    },
    define: {
      'process.env.BUN_RATE_URL': browser_config.rate_url,
      'process.env.API_URL': runtime_config.API_URL,
    },
    minify: process.env.NODE_ENV === 'production' ? true : false,
    sourcemap: process.env.NODE_ENV === 'production' ? 'none' : 'external',
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
      return Promise.all([
        write_html_file({ browser, outDir }, styles),

        copy_image_files({ browser, outDir }),
        write_manifest_file({ browser, outDir }),
      ]).then(() => {
        console.log(chalk.cyan('porumai ... bun build finished ?'))
        return new Promise(resolve => resolve(result.outputs))
      })
    })
    .catch(error => {
      return new Promise((resolve, reject) => {
        reject(error)
      })
    })
}

function write_html_file({ outDir }: BuildArgs, styles: Array<string>) {
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

  return Bun.write(`./${outDir}/popup.html`, template)
}

function write_manifest_file({ browser, outDir }: BuildArgs) {
  console.log(`porumai ... writing manifest for ${browser}`.blue)
  return fs
    .readFile(`./src/manifests/${browser}/manifest.json`, 'utf8')
    .then(data => {
      const manifest = JSON.parse(stripJsonComments(data))
      manifest.version = process.env.npm_package_version
      Bun.write(`./${outDir}/manifest.json`, JSON.stringify(manifest))
    })
    .catch(err => {
      console.error(err)
    })
}

function copy_image_files({ outDir }: BuildArgs) {
  return fs.cp('./src/img', `./${outDir}/img`, { recursive: true }).then(() => {
    console.log('porumai ... img file copied')
  })
}

export function type_check() {
  console.log(chalk.yellow('porumai ... starting type check'))
  return execa('pnpm', ['typecheck'])
    .then(() => {
      console.log(chalk.green('porumai ... typecheck success'))
    })
    .catch(err => {
      console.log(chalk.red('porumai ... typecheck failed'))
      console.log(err.message)
      return Promise.reject(err)
    })
}
