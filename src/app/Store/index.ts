import { configureStore } from '@reduxjs/toolkit'

// reducers
import remindoroReducer from '@app/Store/Slices/Remindoros/'
import settingsReducer from '@app/Store/Slices/Settings/'

// root reducer
const reducer = {
  remindoros: remindoroReducer,
  settings: settingsReducer,
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
