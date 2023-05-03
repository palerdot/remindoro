import browser from 'webextension-polyfill'
import { get } from '@lodash'

import type { RootState } from '@app/Store/'

import { STORAGE_KEY } from '@app/Constants'
import { loadFromStorage } from '@app/Util/BrowserStorage/'
import { migrate_v0_data, OldStoreData } from '@app/Util/cleaners'

function isNewData(oldData: OldStoreData | RootState): oldData is RootState {
  // if we have version field; then we are in 1.x version
  const version = get(oldData, 'version', undefined)

  return version !== undefined
}

export function migrate_v0_data_to_v1() {
  loadFromStorage({
    onSuccess: (oldData: OldStoreData | RootState) => {
      // here we will check if we have a 'version' key
      // if we have a version key, then we are already past migration for '1.x'
      // in that case we will prevent migration
      if (isNewData(oldData)) {
        // do not proceed
        console.log('porumai ... old data MIGRATION STOPPED ', oldData)
        return
      }

      const cleanedData = migrate_v0_data(oldData)

      // saving cleaned data back to browser store
      return browser.storage.local
        .set({ [STORAGE_KEY]: cleanedData })
        .then(() => {
          console.log('porumai ... migration complete ', cleanedData, oldData)
        })
        .catch(() => {
          // error in migration
        })
    },
    onError: () => {
      // failure migrating
    },
  })
}
