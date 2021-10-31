import React from 'react'
import styled from 'styled-components'

import ToggleNotifications from '@app/Components/Settings/ToggleNotifications'

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

function Footer() {
  return (
    <Holder>
      <div className={'icon-holder'}>
        <ToggleNotifications />
      </div>
      <div className={'message-section'}>
        {'porumai ... wait and hope !!! amaidhi ... '}
      </div>
    </Holder>
  )
}

export default Footer
