import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Theme } from '@app/Util/colors'

export interface SettingsState {
  theme: Theme
  liveNoteEnabled: boolean
  notificationsEnabled: boolean
}

const initialState: SettingsState = {
  theme: Theme.Main,
  liveNoteEnabled: true,
  notificationsEnabled: true,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      const selectedTheme = action.payload
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
  },
})

// export actions
export const { setTheme, setLiveNoteStatus, setNotificationsStatus } =
  settingsSlice.actions

export default settingsSlice.reducer
