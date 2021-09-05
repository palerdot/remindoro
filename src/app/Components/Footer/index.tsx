import React from 'react'
import styled from 'styled-components'
import { IconButton } from '@mui/material'
import { NotificationsActive, NotificationsOff } from '@mui/icons-material'

const Holder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;

  border-top: thin solid red;

  & .message-section {
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
  }

  & .icon-holder {
    display: flex;
    align-self: flex-start;

    padding: 0 4px;
  }
`

const IconHolder = styled.div`
  & button {
    border: thin solid transparent;
    padding: 6px;

    &:hover {
      background: grey;
    }
  }

  & .notifications-off {
    color: red;

    /* &:hover {
      border: thin solid lightgreen;
    } */
  }

  & .notifications-on {
    color: lightgreen;

    /* &:hover {
      border: thin solid red;
    } */
  }
`

function Footer() {
  return (
    <Holder>
      <div className={'icon-holder'}>
        <IconHolder>
          <IconButton
            aria-label="Turn on notifications"
            className={'notifications-on'}
            size="large"
          >
            <NotificationsActive />
          </IconButton>
        </IconHolder>

        <IconHolder>
          <IconButton
            aria-label="Turn off notifications"
            className={'notifications-off'}
            size="large"
          >
            <NotificationsOff />
          </IconButton>
        </IconHolder>
      </div>
      <div className={'message-section'}>
        {'porumai ... wait and hope !!! amaidhi ... '}
      </div>
    </Holder>
  )
}

export default Footer
