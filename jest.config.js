/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
const stripJsonComments = require('strip-json-comments')

// ref: https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/
const { pathsToModuleNameMapper } = require('ts-jest/utils')
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
// const { compilerOptions } = require('./tsconfig')
// const tsconfig = stripJsonComments(require('./tsconfig'))
const fs = require('fs')
let tsConfig = fs.readFileSync('./tsconfig.json', 'utf8')
tsConfig = JSON.parse(stripJsonComments(tsConfig))
const { compilerOptions } = tsConfig

const tsPathMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/src/',
})

const moduleNameMapper = {
  ...tsPathMapper,
  // IMPORTANT: we are using lodash-es (ES6 modules exports/imports)
  // jest has problem with es6 modules - https://github.com/facebook/jest/issues/4842
  // and instructing jest to use lodash in test environments
  // we are not adding 'lodash' explicitly as dev dependency since
  // thousands of dev dependency packages already depend on lodash
  // ref: https://stackoverflow.com/a/54117206/1410291
  '^lodash-es$': 'lodash',
}

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper,
}
