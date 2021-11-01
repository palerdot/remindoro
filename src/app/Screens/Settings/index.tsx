import React from 'react'
import styled from 'styled-components'

import Notifications from './Notifications'
import LiveNote from './LiveNote'

const Wrapper = styled.div`
  & .page-heading {
    font-size: 1.3rem;
    margin: 8px 16px;
  }
`

export const Holder = styled.div`
  padding: 16px;
  border-bottom: ${props => `thin solid ${props.theme.border}`};

  & .setting-wrapper {
    display: flex;
    align-items: center;
    padding: 16px 0;

    & .heading {
      flex: 1;
      font-size: 1.25rem;
    }

    & .setting {
      flex: 1;
    }
  }

  & .subtitle {
    color: ${props => props.theme.highlight};
    font-size: 0.95rem;
    font-style: italic;
  }
`

function Settings() {
  return (
    <Wrapper>
      <div className={'page-heading'}>{'Settings'}</div>
      <Notifications />
      <LiveNote />
    </Wrapper>
  )
}

export default Settings
