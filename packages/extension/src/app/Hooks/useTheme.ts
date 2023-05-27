import { useSelector } from 'react-redux'

import type { ThemeInterface } from '@app/Util/colors'
import type { RootState } from '@app/Store/'

import { themes, Theme } from '@app/Util/colors'

function useTheme(): ThemeInterface {
  const theme = useSelector((state: RootState) => state.settings.theme)

  return themes[theme] || themes[Theme.Classic]
}

export default useTheme
