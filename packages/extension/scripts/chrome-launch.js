#!/usr/bin/env node

const path = require('path')
const chromeLaunch = require('chrome-launch') // eslint-disable-line import/no-extraneous-dependencies

require('colors')

const url = 'https://youtube.com'
const dev = path.resolve(__dirname, '..', 'out')
const args = [`--load-extension=${dev}`]

chromeLaunch(url, { args })
