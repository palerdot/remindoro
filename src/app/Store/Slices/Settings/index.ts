import { createSlice } from '@reduxjs/toolkit'

// types
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ThemeInterface } from '@app/Util/colors'

import { defaultTheme } from '@app/Util/colors'

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
    setTheme: (state, action: PayloadAction<ThemeInterface>) => {
      // update theme
      state.theme = action.payload
    },
  },
})

// export actions
export const { setTheme } = settingsSlice.actions

export default settingsSlice.reducer
