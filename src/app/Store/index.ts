import { configureStore } from '@reduxjs/toolkit'

// reducers
import remindoroReducer from '@app/Store/Slices/Remindoros/'
import settingsReducer from '@app/Store/Slices/Settings/'

export const store = configureStore({
  reducer: {
    remindoros: remindoroReducer,
    settings: settingsReducer,
  },
})

// ref: https://redux-toolkit.js.org/tutorials/quick-start

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
