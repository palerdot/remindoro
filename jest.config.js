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

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
}
