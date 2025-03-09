import '@emotion/react'
import type { ThemeInterface } from '@app/Util/colors'
import type { Palette } from '@mui/material'

declare module '@emotion/react' {
  export interface Theme {
    colors: ThemeInterface
    palette: Palette
  }
}
