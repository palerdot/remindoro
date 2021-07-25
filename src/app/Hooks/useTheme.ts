import { useSelector } from 'react-redux'

import type { ThemeInterface } from '@app/Util/colors'
import type { RootState } from '@app/Store/'

import { themes } from '@app/Util/colors'

function useTheme(): ThemeInterface {
  const theme = useSelector((state: RootState) => state.settings.theme)

  return themes[theme]
}

export default useTheme
