import '@emotion/react'
import { ThemeInterface } from '@app/Util/colors'
import { Palette } from '@mui/material'

declare module '@emotion/react' {
  export interface Theme {
    colors: ThemeInterface
    palette: Palette
  }
}
