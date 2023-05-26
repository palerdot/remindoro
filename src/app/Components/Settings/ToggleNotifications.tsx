import React from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { IconButton } from '@mui/material'
import { NotificationsActive, NotificationsOff } from '@mui/icons-material'

import type { RootState } from '@app/Store/'

import { setNotificationsStatus } from '@app/Store/Slices/Settings'
import { useLazyStoreUpdate } from '@app/Hooks/'

const IconHolder = styled.div`
  & button {
    border: thin solid transparent;
    padding: 6px;

    &:hover {
      background: ${props => props.theme.border};
    }
  }

  & .notifications-off {
    color: ${props => props.theme.danger};

    /* &:hover {
      border: thin solid lightgreen;
    } */
  }

  & .notifications-on {
    color: ${props => props.theme.success};

    /* &:hover {
      border: thin solid red;
    } */
  }
`

function ToggleNotifications() {
  const isNotificationsEnabled = useSelector(
    (state: RootState) => state.settings.notificationsEnabled
  )
  const { value: isEnabled, setValue } = useLazyStoreUpdate<boolean>({
    id: 'dummy-id',
    payload: isNotificationsEnabled,
    updater: setNotificationsStatus,
  })

  return (
    <IconHolder onClick={() => setValue(!isEnabled)}>
      {isEnabled ? (
        <IconButton
          aria-label="Notifications on"
          className={'notifications-on'}
          size="large"
        >
          <NotificationsActive />
        </IconButton>
      ) : (
        <IconButton
          aria-label="Notifications off"
          className={'notifications-off'}
          size="large"
        >
          <NotificationsOff />
        </IconButton>
      )}
    </IconHolder>
  )
}

export default ToggleNotifications
