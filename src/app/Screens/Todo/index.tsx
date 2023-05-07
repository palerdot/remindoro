import React from 'react'
import styled from 'styled-components'

import InfoBanner from '@app/Components/InfoBanner'

const Wrapper = styled.div`
  padding: 20px;
`

function Todo() {
  return (
    <Wrapper>
      <InfoBanner>
        {
          'No notes marked as todo. You can mark a note as todo in the settings page. Todo notes count will be shown as a badge on top of extension icon.'
        }
      </InfoBanner>
      <div>{'porumai ... will show todo notes'}</div>
    </Wrapper>
  )
}

export default Todo
