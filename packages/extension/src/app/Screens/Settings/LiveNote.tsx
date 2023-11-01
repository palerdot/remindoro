import React from 'react'
import { useSelector } from 'react-redux'

import type { RootState } from '@app/Store/'

import { setLiveNoteStatus } from '@app/Store/Slices/Settings'
import { useLazyStoreUpdate } from '@app/Hooks/'
import { Holder } from './'
import Switch from '@app/Components/Switch'

function Notifications() {
  const isLiveNoteEnabled = useSelector(
    (state: RootState) => state.settings.liveNoteEnabled
  )

  const { value: isEnabled, setValue } = useLazyStoreUpdate<boolean>({
    id: 'dummy-id',
    payload: isLiveNoteEnabled,
    updater: setLiveNoteStatus,
  })

  return (
    <Holder>
      <div className={'setting-wrapper'}>
        <div className={'heading'}>{'Rich Text Editing (beta):'}</div>
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
          'Enable/Disable experimental Rich Text Editor. This is currently in Beta. Rich Text Editor allows to edit the note using rich text semantics like bold, italic, ordered/unordered list, checklist items etc.If you face any problems using this feature, please let me know by my email - arun@remindoro.app'
        }
      </div>
    </Holder>
  )
}

export default Notifications
