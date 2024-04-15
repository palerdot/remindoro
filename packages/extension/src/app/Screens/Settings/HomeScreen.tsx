import React from 'react'
import { useSelector } from 'react-redux'
import { FormControl, Select, MenuItem } from '@mui/material'

import type { RootState } from '@app/Store/'

import { HomeScreenSetting as HomeScreenSettings } from '@app/Store/Slices/Settings'
import { setHomeScreen } from '@app/Store/Slices/Settings'
import { useLazyStoreUpdate } from '@app/Hooks/'
import { Holder } from './'

function HomeScreenSetting() {
  const currentHomeScreen = useSelector(
    (state: RootState) => state.settings.homeScreen
  )

  const { value, setValue } = useLazyStoreUpdate<HomeScreenSettings>({
    id: 'dummy-id',
    payload: currentHomeScreen,
    updater: setHomeScreen,
  })

  return (
    <Holder>
      <div className={'setting-wrapper'}>
        <div className={'heading'}>{'Home Screen:'}</div>
        <div className={'setting'}>
          <FormControl className={'select-form'}>
            <Select
              displayEmpty
              id="repeat-interval"
              value={value}
              onChange={event => {
                setValue(event.target.value as HomeScreenSettings)
              }}
            >
              <MenuItem value={HomeScreenSettings.Reminders}>
                {'Reminders'}
              </MenuItem>
              <MenuItem value={HomeScreenSettings.Dashboard}>
                {'Dashboard'}
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={'subtitle'}>
        {value === HomeScreenSettings.Reminders
          ? 'Reminders will be shown in the home page'
          : 'Dashboard (Reminders statistics and Time tracker site statistics) will be shown in the home page.'}
      </div>
    </Holder>
  )
}

export default HomeScreenSetting
