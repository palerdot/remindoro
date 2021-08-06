import { browser } from 'webextension-polyfill-ts'
import { loadFromStorage } from '@app/Util/BrowserStorage/'

import type { RootState } from '@app/Store/'

import { STORAGE_KEY } from '@app/Constants'
import { migrate_v0_data, OldStoreData } from '@app/Util/cleaners'

export function migrate_v0_data_to_v1() {
  loadFromStorage({
    onSuccess: (oldData: OldStoreData | RootState) => {
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
