import React, { useEffect, useCallback, useRef } from 'react'
import { debounce, isEqual, isUndefined, merge } from '@lodash'
import { Provider } from 'react-redux'

import type { RootState } from '@app/Store/'

import { getTodoCount, setBadgeText } from 'background/utils/'
import ErrorBoundary from '@app/Components/ErrorBoundary'
import App from './App'
import { getStore } from '@app/Store/'
import { syncToStorage } from '@app/Util/BrowserStorage/'
import { Theme } from './Util/colors'

/*
 * AppStore - App + Store !!!
 *
 * NOTE: Wrapping App with Redux Store provider
 *
 * we are wrapping here, so that we can access store inside 'App'
 */

// debounced store update
const debouncedStoreUpdate = debounce(currentState => {
  syncToStorage({
    currentState,
    onSuccess: _storedState => {},
    onError: () => {
      console.error('Error storing store state ')
    },
  })
}, 314)

// debounced todo badge updated
const debouncedTodoBadgeUpdate = debounce((status: number) => {
  const text = status >= 1 ? `${status}` : ''
  setBadgeText(text)
}, 515)

type InitialState = RootState | undefined

type Props = {
  initialState: InitialState
}

const defaultState: RootState = {
  remindoros: [],
  settings: {
    theme: Theme.Classic,
    liveNoteEnabled: false,
    notificationsEnabled: true,
  },
  version: '0.0.0',
}

const AppStore = ({ initialState }: Props) => {
  let preLoadedState: RootState | undefined = initialState

  if (!isUndefined(initialState)) {
    // we are providing sensible defaults if we are adding new state in the middle
    preLoadedState = merge(defaultState, initialState)
  }

  const store = getStore(preLoadedState)
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

    // check if todo count has changed
    const currentTodoCount = getTodoCount(currentState.remindoros)
    if (
      previousState.current &&
      currentTodoCount !== getTodoCount(previousState.current.remindoros)
    ) {
      // update todo count badge
      debouncedTodoBadgeUpdate(currentTodoCount)
    }

    // update previous state
    previousState.current = currentState
  })

  const onAppClose = useCallback(() => {
    const currentState = store.getState()
    // save current state to browser storage before exiting
    syncToStorage({
      currentState,
      onSuccess: () => {},
      onError: () => {},
    })
    // and unsubscribe events
    unsubscribeStore()
  }, [store, unsubscribeStore])

  useEffect(() => {
    window.addEventListener('unload', onAppClose)
    return onAppClose
  }, [onAppClose])

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  )
}

export default AppStore
