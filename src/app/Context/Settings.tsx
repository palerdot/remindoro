import React, { useState } from 'react'
import { ThemeProvider } from 'styled-components'

import type { ThemeInterface } from '@app/Util/colors'

import { defaultTheme } from '@app/Util/colors'

type SettingsContextType = {
  theme: ThemeInterface
  setTheme: React.Dispatch<React.SetStateAction<ThemeInterface>>
}

const defaultValue: SettingsContextType = {
  theme: defaultTheme,
  setTheme: () => {},
}

export const SettingsContext = React.createContext(defaultValue)

type Props = {
  children: React.ReactNode
}

export default function ({ children }: Props) {
  // configure theme
  const [theme, setTheme] = useState(defaultTheme)

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SettingsContext.Provider>
  )
}
