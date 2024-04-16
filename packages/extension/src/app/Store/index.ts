import { configureStore } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

import packageInfo from '@package-info'
// reducers
import remindoroReducer from '@app/Store/Slices/Remindoros/'
import settingsReducer from '@app/Store/Slices/Settings/'
import accountReducer from '@app/Store/Slices/Account/'
import tempReducer from '@app/Store/Slices/Temp/'

const { version } = packageInfo

// root reducer
const reducer = {
  remindoros: remindoroReducer,
  settings: settingsReducer,
  account: accountReducer,

  // temp data storage
  temp: tempReducer,

  // we are starting to store the current app version starting 1.x
  // fow now mainly, we are using this to prevent initial migration
  // if already migrated (version number means it is 1.x, and migration is done)
  version: () => version,
}

export const getStore = (initialState: RootState | undefined) =>
  configureStore({
    reducer,
    preloadedState: initialState,
  })

// ref: https://redux-toolkit.js.org/tutorials/quick-start
// just for inferring states
const store = configureStore({
  reducer,
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export function useHasChangelogHistory() {
  const version = useSelector((state: RootState) => state.version)
  const histories = useSelector(
    (state: RootState) => state.temp.changelogHistories
  )

  const has_history = histories.find(
    h => h.version === version && h.viewed_at !== undefined
  )

  return has_history ? true : false
}

export function useCurrentVersion() {
  const version = useSelector((state: RootState) => state.version)

  return version
}
