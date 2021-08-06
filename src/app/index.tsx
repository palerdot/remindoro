import React, { useState, useMemo, useEffect } from 'react'
import { debounce } from 'lodash'
import { Provider } from 'react-redux'

import { RootState } from '@app/Store/'

import App from './App'
import { getStore } from '@app/Store/'

/*
 * AppStore - App + Store !!!
 *
 * NOTE: Wrapping App with Redux Store provider
 *
 * we are wrapping here, so that we can access store inside 'App'
 */

// debounced store update
const debouncedStoreUpdate = debounce(currentState => {
  console.log('porumai ... current store state ', currentState)
}, 1314)

const AppStore = () => {
  const [initialState] = useState<RootState | undefined>(undefined)

  const store = useMemo(() => {
    return getStore(initialState)
  }, [initialState])

  const unsubscribeStore = store.subscribe(() => {
    debouncedStoreUpdate(store.getState())
  })

  useEffect(() => {
    return () => {
      console.log('porumai ... unmounting app ')
      unsubscribeStore()
    }
  })

  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default AppStore
