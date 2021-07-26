import { browser } from 'webextension-polyfill-ts'

/*
 * ref: https://github.com/Lusito/webextension-polyfill-ts
 * ref: https://github.com/mozilla/webextension-polyfill
 */

function initRemindoro() {
  console.log('porumai .... wait and hope ... TS background logic')

  browser.storage.local.get('REMINDORO').then(data => {
    console.log('porumai ... remindoro data ', data)
  })
}

initRemindoro()
