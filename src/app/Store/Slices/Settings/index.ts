import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Theme } from '@app/Util/colors'

export interface SettingsState {
  theme: Theme
}

const initialState: SettingsState = {
  theme: Theme.Main,
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
  },
})

// export actions
export const { setTheme } = settingsSlice.actions

export default settingsSlice.reducer
