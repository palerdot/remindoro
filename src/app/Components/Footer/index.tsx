import React from 'react'
import styled from 'styled-components'

import ToggleNotifications from '@app/Components/Settings/ToggleNotifications'

const Holder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;

  border-top: ${props => `thin solid ${props.theme.borderDark}`};
  background: ${props => props.theme.borderDark};

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
      <div className={'message-section'}>{''}</div>
    </Holder>
  )
}

export default Footer
