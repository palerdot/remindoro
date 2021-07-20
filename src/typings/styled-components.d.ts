// https://github.com/styled-components/styled-components/issues/1589#issuecomment-456641381

import { ThemeInterface } from '@app/Util/colors'

declare module 'styled-components' {
  // we are instructing styled components declaration to extend
  // default theme with out theme
  interface DefaultTheme extends ThemeInterface {}
}
