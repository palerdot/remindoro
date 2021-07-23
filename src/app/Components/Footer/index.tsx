import React from 'react'
import styled from 'styled-components'

import { NotificationsActive, NotificationsOff } from '@material-ui/icons'

const Holder = styled.div`
  display: flex;
  margin-top: auto;

  border-top: thin solid red;
  padding: 8px;
`

function Footer() {
  return (
    <Holder>
      {'porumai ... wait and hope !!!'}
      <NotificationsActive />
      <NotificationsOff />
    </Holder>
  )
}

export default Footer
