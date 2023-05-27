import React from 'react'
import { useSelector } from 'react-redux'
import { FormControl, Select, MenuItem } from '@mui/material'

import type { RootState } from '@app/Store/'

import { Theme } from '@app/Util/colors'
import { setTheme } from '@app/Store/Slices/Settings'
import { useLazyStoreUpdate } from '@app/Hooks/'
import { Holder } from './'

function ThemeSetting() {
  const currentTheme = useSelector((state: RootState) => state.settings.theme)

  const { value, setValue } = useLazyStoreUpdate<Theme>({
    id: 'dummy-id',
    payload: currentTheme,
    updater: setTheme,
  })

  return (
    <Holder>
      <div className={'setting-wrapper'}>
        <div className={'heading'}>{'Theme:'}</div>
        <div className={'setting'}>
          <FormControl className={'select-form'}>
            <Select
              displayEmpty
              id="repeat-interval"
              value={value}
              onChange={event => {
                setValue(event.target.value as Theme)
              }}
            >
              {Object.values(Theme).map(theme => (
                <MenuItem value={theme} key={theme}>
                  {theme}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={'subtitle'}>{'Customize your Remindoro experience.'}</div>
    </Holder>
  )
}

export default ThemeSetting
