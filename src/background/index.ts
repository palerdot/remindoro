import { browser } from 'webextension-polyfill-ts'

import { version } from '@package-info'
import { migrate_v0_data_to_v1 } from './utils/'
import { notify } from './utils/notification'

/*
 * ref: https://github.com/Lusito/webextension-polyfill-ts
 * ref: https://github.com/mozilla/webextension-polyfill
 */

/*
 * Install Events
 */

browser.runtime.onInstalled.addListener(initializeInstallEvents)

function initializeInstallEvents() {
  console.log('porumai ... initing install events ', version)
  // migrating v0.x => v1.x data
  // mostly harmless migration - removing unwanted keys
  // we don't have to wait for migration - fire and forget!!!
  // also we will not repeatedly migrate if we are already in v1.x
  // we will be checking for 'version' key which is present in v.1.x
  migrate_v0_data_to_v1()

  // welcome message
  const welcome_message = {
    title: `Hello from Remindoro - ${version} !`,
    note:
      'Welcome to new refreshed Remindoro! You can now set one-time/repeatable reminders (with markdown support) for stuffs that matter to you ...',
  }

  notify(welcome_message)
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
