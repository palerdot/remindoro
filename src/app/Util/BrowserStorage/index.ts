import { browser } from 'webextension-polyfill-ts'

import type { RootState } from '@app/Store/'

import { STORAGE_KEY } from '@app/Constants'
import { notify } from '@background/utils/notification'

interface Callback {
  onSuccess: (state: RootState) => void
  onError: () => void
}

interface SyncToStorage extends Callback {
  currentState: RootState
}

/*
 * Syncs current state to browser storage
 *
 * @params
 * currentState: Remindoro
 *
 * called, when popup/app is unloaded, and whenever state changes
 */

export function syncToStorage({
  currentState,
  onSuccess,
  onError,
}: SyncToStorage) {
  // save the store data to local storage
  return browser.storage.local
    .set({ [STORAGE_KEY]: currentState })
    .then(() => {
      onSuccess(currentState)
    })
    .catch(() => {
      onError()
      handle_browser_error()
    })
}

/*
 * Loads current state from browser storage
 */

export function loadFromStorage({ onSuccess, onError }: Callback) {
  return browser.storage.local
    .get(STORAGE_KEY)
    .then(browserState => {
      onSuccess(browserState[STORAGE_KEY])
    })
    .catch(() => {
      onError()
      handle_browser_error()
    })
}

/*
 * handle browser error
 *
 * Like if we exceed browser quota or something similar
 */
function handle_browser_error() {
  // returns false if there is no chrome runtime error
  if (!browser.runtime.lastError) {
    return false
  }

  // there is an runtime error
  const browser_error =
    (browser.runtime.lastError.message || '').indexOf('QUOTA_BYTES') >= 0
      ? 'storage'
      : 'general'

  console.log('BROWSER ERROR ', browser_error)

  // show chrome notification
  const error = {
    title: '',
    message: '',
  }

  if (browser_error == 'storage') {
    // storage error
    error.title = 'Browser Storage Limit maybe Exceeded'
    error.message = 'Please try deleting few reminders and try again.'
  } else {
    // some error not related to storage
    error.title = 'Error ...'
    error.message =
      'Please try deleting few reminders and try again. If issue persists, please leave a feedback in Extension page'
  }

  notify({
    id: 'browser-error',
    title: error.title,
    note: error.message,
  })

  // return a string to indicate what is the error
  return
}
