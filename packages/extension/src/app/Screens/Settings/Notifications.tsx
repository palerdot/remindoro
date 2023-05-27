import React from 'react'
import { useSelector } from 'react-redux'

import type { RootState } from '@app/Store/'

import { setNotificationsStatus } from '@app/Store/Slices/Settings'
import { useLazyStoreUpdate } from '@app/Hooks/'
import { Holder } from './'
import Switch from '@app/Components/Switch'

function Notifications() {
  const isNotificationsEnabled = useSelector(
    (state: RootState) => state.settings.notificationsEnabled
  )

  const { value: isEnabled, setValue } = useLazyStoreUpdate<boolean>({
    id: 'dummy-id',
    payload: isNotificationsEnabled,
    updater: setNotificationsStatus,
  })

  return (
    <Holder>
      <div className={'setting-wrapper'}>
        <div className={'heading'}>{'Notifications:'}</div>
        <div className={'setting'}>
          <Switch
            onText={'On'}
            offText={'Off'}
            checked={isEnabled}
            setChecked={status => {
              setValue(status)
            }}
          />
        </div>
      </div>
      <div className={'subtitle'}>
        {
          'Pause/Resume Notifications. You can also do this from bottom left corner of the screen.'
        }
      </div>
    </Holder>
  )
}

export default Notifications
