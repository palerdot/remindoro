import '@emotion/react'
import { ThemeInterface } from '@app/Util/colors'

declare module '@emotion/react' {
  export interface Theme extends ThemeInterface {}
}
