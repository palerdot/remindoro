import { browser } from 'webextension-polyfill-ts'

import { migrate_v0_data_to_v1 } from './utils/'

/*
 * ref: https://github.com/Lusito/webextension-polyfill-ts
 * ref: https://github.com/mozilla/webextension-polyfill
 */

/*
 * Install Events
 */

browser.runtime.onInstalled.addListener(initializeInstallEvents)

function initializeInstallEvents() {
  console.log('porumai ... initing install events')
  // migrating v0.x => v1.x data
  // mostly harmless migration - removing unwanted keys
  // we don't have to wait for migration - fire and forget!!!
  migrate_v0_data_to_v1()
}

/*
 * Init Background tasks
 */

function initRemindoro() {
  console.log('porumai .... wait and hope ... TS background logic')

  browser.storage.local.get('REMINDORO').then(data => {
    console.log('porumai ... remindoro data ', data)
  })
}

initRemindoro()
