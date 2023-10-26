import React, { useState, useEffect } from 'react'
import { Provider } from 'tinybase/ui-react'
import { createStore, Store } from 'tinybase'
import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db'
import { Box, CircularProgress } from '@mui/material'

import { STORE_KEY } from '@background/time-tracker/store'

type Props = {
  children: React.ReactElement
}

function TinyBase({ children }: Props) {
  const [store, setStore] = useState<Store>()

  useEffect(() => {
    const store = createStore()
    const persistor = createIndexedDbPersister(store, STORE_KEY)

    persistor
      .startAutoLoad()
      .then(() => {
        console.log('TinyBase: persistor autoloaded with indexed db store')
      })
      .catch(e => {
        console.error('TinyBase: autoload error ', e)
      })

    persistor
      .startAutoSave()
      .then(() => {
        console.log(
          'TinyBase: persistor auto save started with indexed db store'
        )
      })
      .catch(e => {
        console.error('TinyBase: autosave error ', e)
      })

    document.addEventListener('visibilitychange', () => {
      // clean up when the extension unloads/closes
      // ref: https://developer.chrome.com/blog/deprecating-unload/
      if (document.visibilityState === 'hidden') {
        persistor.destroy()
      }
    })

    // set store and proceed to app rendering
    setStore(store)
  }, [setStore])

  if (!store) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '98%',
          background: '#F1F3F6',
          color: '#0C15CE',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return <Provider store={store}>{children}</Provider>
}

export default TinyBase
