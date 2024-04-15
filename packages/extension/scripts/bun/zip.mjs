import chalk from 'chalk'
import { zip } from 'zip-a-folder'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv)).parseSync()
const source = argv.source
const target = argv.target

zip(source, target)
  .then(() => {
    console.log(chalk.blue(`${target} file created`))
  })
  .catch(err => {
    console.error(err)
  })
