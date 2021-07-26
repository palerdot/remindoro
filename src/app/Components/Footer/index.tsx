import React from 'react'
import styled from 'styled-components'
import { IconButton } from '@material-ui/core'
import { NotificationsActive, NotificationsOff } from '@material-ui/icons'

const Holder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;

  border-top: thin solid red;
  padding: 4px;

  & .message-section {
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
  }

  & .icon-holder {
    display: flex;
    align-self: flex-start;
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
          >
            <NotificationsActive />
          </IconButton>
        </IconHolder>

        <IconHolder>
          <IconButton
            aria-label="Turn off notifications"
            className={'notifications-off'}
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
