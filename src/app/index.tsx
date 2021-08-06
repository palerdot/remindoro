import React, { useEffect, useRef } from 'react'
import { debounce, isEqual } from 'lodash'
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
  // saving previous state (to compare before updating)
  let previousState = useRef(initialState)

  const unsubscribeStore = store.subscribe(() => {
    const currentState = store.getState()
    // before updating, let us compare current state with previous state
    if (isEqual(currentState, previousState.current)) {
      // do not proceed
      return
    }
    debouncedStoreUpdate(currentState)
    // update previous state
    previousState.current = currentState
  })

  const onAppClose = () => {
    const currentState = store.getState()
    // save current state to browser storage before exiting
    syncToStorage({
      currentState,
      onSuccess: () => {},
      onError: () => {},
    })
    // and unsubscribe events
    unsubscribeStore()
  }

  useEffect(() => {
    window.addEventListener('unload', onAppClose)
    return onAppClose
  })

  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default AppStore
