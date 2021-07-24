import { createSlice } from '@reduxjs/toolkit'

// types
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ThemeInterface, Theme } from '@app/Util/colors'

import { defaultTheme, themes } from '@app/Util/colors'

export interface SettingsState {
  theme: ThemeInterface
}

const initialState: SettingsState = {
  theme: defaultTheme,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      const selectedTheme = action.payload
      // update theme
      state.theme = themes[selectedTheme]
    },
  },
})

// export actions
export const { setTheme } = settingsSlice.actions

export default settingsSlice.reducer
