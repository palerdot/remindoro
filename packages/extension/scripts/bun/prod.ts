process.env.NODE_ENV = 'production'

import { statSync } from 'fs'
import fs from 'node:fs/promises'
import chalk from 'chalk'
import { isString, takeRight } from 'lodash-es'
import { gzipSizeFromFileSync } from 'gzip-size'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import prettyBytes from 'pretty-bytes'
import { execa } from 'execa'

import { build, type_check } from './utils'
import { BuildArtifact } from 'bun'

const argv = yargs(hideBin(process.argv)).parseSync()
const browser = argv.browser
const is_valid_browser =
  isString(browser) && ['chrome', 'firefox'].includes(browser)
if (!is_valid_browser) {
  console.log('porumai ... not a valid browser ', browser)
  process.exit(1)
}

const OUT_DIR = `release`
const BUILD_DIR = `${OUT_DIR}/${browser}`

prod_build()

function prod_build() {
  type_check()
    .then(() => {
      return start()
    })
    .catch(err => {
      console.log(chalk.red('porumai ... prod build failed'))
    })
}

function start() {
  if (!is_valid_browser) {
    process.exit(1)
  }

  return fs
    .rm(`./${OUT_DIR}`, { force: true })
    .then(() => {
      console.log(`porumai ... ${OUT_DIR} deleted `.yellow)
      return build({
        browser,
        outDir: BUILD_DIR,
      })
    })
    .then(outputs => {
      const results: BuildArtifact[] = outputs as BuildArtifact[]
      for (const r of results) {
        try {
          const gzip_size = gzipSizeFromFileSync(r.path)
          const response = statSync(r.path)
          // const file_name = last(r.path.split('/'))
          const file_name = takeRight(r.path.split('/'), 2).join('/')
          console.log(
            `${file_name} ==> ${prettyBytes(gzip_size)} (${prettyBytes(
              response.size
            )})`
          )
        } catch (e) {
          console.error(e)
        }
      }

      return Promise.resolve()
    })
    .then(() => {
      const npm_version = process.env.npm_package_version
      const release_zip_name = `remindoro-${browser}-v${npm_version}.zip`

      const ZIP_SOURCE = BUILD_DIR
      const ZIP_TARGET = `${OUT_DIR}/${release_zip_name}`
      console.log(chalk.blue(`porumai ... zipping ${ZIP_TARGET}`))

      return execa('node', [
        `${import.meta.dir}/zip.mjs`,
        '--source',
        ZIP_SOURCE,
        '--target',
        ZIP_TARGET,
      ])
        .then(result => {
          console.log(result.stdout)
        })
        .catch(err => {
          console.error(err)
        })
    })
    .then(() => {
      console.log(
        chalk.cyan(
          `porumai ... remindoro-${browser}-v${process.env.npm_package_version} prod build finished`
        )
      )
    })
    .catch(err => {
      console.error('porumai ... build error', err)
    })
}
