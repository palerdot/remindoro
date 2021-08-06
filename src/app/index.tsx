import React, { useEffect } from 'react'
import { debounce } from 'lodash'
import { Provider } from 'react-redux'

import type { RootState } from '@app/Store/'

import App from './App'
import { getStore } from '@app/Store/'
import { syncToStorage } from '@app/Util/BrowserStorage/'

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
  syncToStorage({
    currentState,
    onSuccess: storedState => {
      console.log('porumai ... store sync success ', storedState)
    },
    onError: () => {
      console.log('porumai ... error storing store state ')
    },
  })
}, 1314)

type InitialState = RootState | undefined

type Props = {
  initialState: InitialState
}

const AppStore = ({ initialState }: Props) => {
  const store = getStore(initialState)

  const unsubscribeStore = store.subscribe(() => {
    debouncedStoreUpdate(store.getState())
  })

  useEffect(() => {
    window.addEventListener('unload', () => {
      console.log('porumai ... unmounting app ')
      unsubscribeStore()
    })
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
