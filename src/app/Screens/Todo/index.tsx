import React from 'react'
import styled from 'styled-components'
import { orderBy } from '@lodash'

import { useTodoRemindoros } from '@app/Store/Slices/Remindoros'
import Remindoros from '@app/Components/Remindoros/'
import InfoBanner from '@app/Components/InfoBanner'

const Wrapper = styled.div`
  padding: 20px;
`

function Todo() {
  // sort remindoros
  const sortedRemindoros = orderBy(useTodoRemindoros(), 'updated', 'desc')

  return (
    <Wrapper>
      {sortedRemindoros.length === 0 ? (
        <InfoBanner>
          {
            'No notes marked as todo. You can mark a note as todo in the settings page. Todo notes count will be shown as a badge on top of extension icon.'
          }
        </InfoBanner>
      ) : (
        <Remindoros remindoros={sortedRemindoros} />
      )}
    </Wrapper>
  )
}

export default Todo
