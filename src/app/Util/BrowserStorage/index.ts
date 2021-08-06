import { browser } from 'webextension-polyfill-ts'

import type { RootState } from '@app/Store/'

import { STORAGE_KEY } from '@app/Constants'

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
    })
}
