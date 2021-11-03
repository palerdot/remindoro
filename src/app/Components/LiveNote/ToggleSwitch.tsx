import React from 'react'
import styled from 'styled-components'

import HelpIcon from '@app/Components/LiveNote/Help/Icon'
import Switch from '@app/Components/Switch'
import { setLiveNoteStatus } from '@app/Store/Slices/Settings'
import { useLazyStoreUpdate } from '@app/Hooks/'

type Props = {
  checked: boolean
}

const Holder = styled.div`
  display: flex;
  align-items: center;
`

const DisabledText = styled.span`
  font-style: italic;
  font-size: 0.89rem;

  color: ${props => props.theme.highlight};
`

const EnabledText = styled.span`
  font-style: normal;
  font-size: 1rem;

  color: ${props => props.theme.highlight};
`

function ToggleSwitch({ checked }: Props) {
  const { value, setValue } = useLazyStoreUpdate<boolean>({
    id: 'dummy-id',
    payload: checked,
    updater: setLiveNoteStatus,
  })

  return (
    <Holder className={'live-note-switch'}>
      {checked ? (
        <>
          <HelpIcon />
          <EnabledText>{'Rich Text (beta)'}</EnabledText>
        </>
      ) : (
        <DisabledText>{'Enable Rich Text formatting (beta)'}</DisabledText>
      )}
      <Switch
        onText={''}
        offText={''}
        checked={value}
        setChecked={status => {
          setValue(status)
        }}
      />
    </Holder>
  )
}

export default ToggleSwitch
