import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Theme } from '@app/Util/colors'

export enum HomeScreenSetting {
  Reminders = 'reminders',
  Dashboard = 'dashboard',
}

export interface SettingsState {
  theme: Theme
  liveNoteEnabled: boolean
  notificationsEnabled: boolean
  homeScreen: HomeScreenSetting
}

const initialState: SettingsState = {
  theme: Theme.Classic,
  liveNoteEnabled: false,
  notificationsEnabled: true,
  homeScreen: HomeScreenSetting.Reminders,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<{ id: string; value: Theme }>) => {
      const { value: selectedTheme } = action.payload
      // update theme
      state.theme = selectedTheme
    },

    // enables new experimental live note
    setLiveNoteStatus: (
      state,
      action: PayloadAction<{ id: string; value: boolean }>
    ) => {
      // dummy id passed to match the api of 'lazy store update'
      const { value } = action.payload
      state.liveNoteEnabled = value
    },

    // enables/disables notification
    setNotificationsStatus: (
      state,
      action: PayloadAction<{ id: string; value: boolean }>
    ) => {
      // dummy id passed to match the api of 'lazy store update'
      const { value } = action.payload
      state.notificationsEnabled = value
    },

    // home screen
    setHomeScreen: (
      state,
      action: PayloadAction<{ id: string; value: HomeScreenSetting }>
    ) => {
      // dummy id passed to match the api of 'lazy store update'
      const { value } = action.payload
      state.homeScreen = value
    },
  },
})

// export actions
export const {
  setTheme,
  setLiveNoteStatus,
  setNotificationsStatus,
  setHomeScreen,
} = settingsSlice.actions

export default settingsSlice.reducer
